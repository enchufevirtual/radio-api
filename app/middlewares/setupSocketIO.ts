import { Server as WebSocketsServer, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import * as http from 'http';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { getAvatarUrl, mapMessagesToUserImages } from './socketUtils';

interface ChatMessage {
  id: string;
  userId: number;
  username: string;
  role: string;
  from: string;
  name: string;
  image: string | null;
  body: string;
  createAt: string;
}

interface ClientChatPayload {
  body: string;
  userId: number;
}

const MAX_MESSAGES = 100;
const HISTORY_SIZE = 50;
const RATE_LIMIT_WINDOW_MS = 30_000;
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_CLEANUP_MS = 60_000; // Cleanup old entries every 1 minute

const domPurify = createDOMPurify(new JSDOM('').window as unknown as Window & typeof globalThis);
const messages: ChatMessage[] = [];
const userRateLimits = new Map<number, number[]>();
const connectedUsers = new Set<string>(); // Track connected socket IDs (legacy: sockets)

// Owner maps for unique user counting: ownerKey -> `user:<id>` or `guest:<clientId>`
const socketToOwner = new Map<string, string>();
const ownerToSockets = new Map<string, Set<string>>();

// Token-bucket rate limiter state per ownerKey
type Bucket = { tokens: number; lastRefill: number };
const buckets = new Map<string, Bucket>();
const BUCKET_CAPACITY = RATE_LIMIT_MAX; // max tokens
const BUCKET_INTERVAL_MS = RATE_LIMIT_WINDOW_MS; // refill period

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [userId, timestamps] of userRateLimits.entries()) {
    const windowed = timestamps.filter((ts) => now - ts <= RATE_LIMIT_WINDOW_MS);
    if (windowed.length === 0) {
      userRateLimits.delete(userId);
    } else {
      userRateLimits.set(userId, windowed);
    }
  }
}, RATE_LIMIT_CLEANUP_MS);

export let ioServer: WebSocketsServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> | null = null;

export const emitUserImageUpdate = (userId: number, image: string | null) => {
  const updatedMessages = messages.filter((message) => message.userId === userId);
  if (updatedMessages.length > 0) {
    updatedMessages.forEach((message) => {
      message.image = getAvatarUrl(image, message.userId, message.username);
    });
  }
  if (ioServer) {
    ioServer.emit('chat:user-image-updated', { userId, avatarUrl: getAvatarUrl(image, userId, `user${userId}`) });
  }
};

export const setupSocketIO = (server: http.Server) => {
  const io = new WebSocketsServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    }
  });
  ioServer = io;

  // Optional auth middleware: accept JWT in `handshake.auth.token` (non-blocking)
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth && (socket.handshake.auth as any).token;
      const clientId = socket.handshake.auth && (socket.handshake.auth as any).clientId;

      if (token) {
        try {
          const payload = jwt.verify(token, config.jwtSecret) as any;
          if (payload && payload.id) {
            socket.data.userId = Number(payload.id);
            socket.data.ownerKey = `user:${socket.data.userId}`;
          }
        } catch (err) {
          // invalid token -> ignore and allow guest flow
        }
      }

      if (!socket.data.ownerKey) {
        // use provided clientId to dedupe anonymous users, otherwise fallback to socket.id
        const cid = clientId || socket.id;
        socket.data.clientId = cid;
        socket.data.ownerKey = `guest:${cid}`;
      }

      return next();
    } catch (err) {
      return next();
    }
  });

  io.on('connection', (socket: Socket) => {
    // Track new connection (legacy)
    connectedUsers.add(socket.id);

    // Associate socket -> ownerKey and ownerKey -> sockets
    const ownerKey = socket.data && (socket.data.ownerKey as string) || `guest:${socket.id}`;
    socketToOwner.set(socket.id, ownerKey);
    const set = ownerToSockets.get(ownerKey) ?? new Set<string>();
    set.add(socket.id);
    ownerToSockets.set(ownerKey, set);

    const usersOnlineCount = ownerToSockets.size; // unique owners

    // Emit users online count to all clients (unique owners)
    io.emit('chat:users-online', { count: usersOnlineCount });
    
    socket.on('error', (error: Error) => {
      socket.emit('chat:error', { message: error.message });
    });

    // Emit history but map images to current user images so profile updates reflect across clients
    (async () => {
      try {
        const history = [...messages].slice(0, HISTORY_SIZE).reverse();
        const userIds = Array.from(new Set(history.map((m) => m.userId))).filter(Boolean);
        if (userIds.length === 0) {
          socket.emit('chat:history', history);
          return;
        }
        const { sequelize } = await import('../libs/sequelize');
        const users = await sequelize.models.User.findAll({ where: { id: userIds }, attributes: ['id', 'image'] });
        const userImages: Record<number, string | null> = {};
        users.forEach((u: any) => { userImages[Number(u.id)] = u.image || null; });
        const mapped = mapMessagesToUserImages(history, userImages);
        socket.emit('chat:history', mapped);
      } catch (err) {
        // on error, fallback to original history
        socket.emit('chat:history', [...messages].slice(0, HISTORY_SIZE).reverse());
      }
    })();

    socket.on('chat:send', async (payload: ClientChatPayload) => {
      try {

        // Prefer authenticated userId from socket.data; fall back to payload.userId (preserve existing behavior)
        const effectiveUserId = Number(socket.data?.userId ?? payload.userId ?? 0);
        if (!effectiveUserId || !payload.body) {
          socket.emit('chat:error', { message: 'Datos de usuario inválidos o mensaje vacío.' });
          return;
        }

        // Rate limiting using token-bucket per ownerKey (authenticated users will have ownerKey `user:<id>`)
        const owner = socketToOwner.get(socket.id) ?? (socket.data && socket.data.ownerKey) ?? `user:${effectiveUserId}`;
        const now = Date.now();
        const bucket = buckets.get(owner) ?? { tokens: BUCKET_CAPACITY, lastRefill: now };
        // refill tokens
        const elapsed = Math.max(0, now - bucket.lastRefill);
        const refill = (elapsed / BUCKET_INTERVAL_MS) * BUCKET_CAPACITY;
        bucket.tokens = Math.min(BUCKET_CAPACITY, bucket.tokens + refill);
        bucket.lastRefill = now;

        if (bucket.tokens < 1) {
          buckets.set(owner, bucket);
          socket.emit('chat:error', { message: 'Has superado el límite de mensajes. Espera unos segundos.' });
          return;
        }
        bucket.tokens -= 1;
        buckets.set(owner, bucket);

        const { sequelize } = await import('../libs/sequelize');
        const user = await sequelize.models.User.findByPk(effectiveUserId, {
          attributes: ['id', 'username', 'role', 'image']
        });

        if (!user) {
          socket.emit('chat:error', { message: 'Usuario no encontrado.' });
          return;
        }

        const safeUser = user as unknown as { id: number; username: string; role: string; image: string | null };

        const sanitizedBody = domPurify.sanitize(payload.body, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: []
        }).trim();

        if (!sanitizedBody) {
          socket.emit('chat:error', { message: 'El mensaje no puede estar vacío.' });
          return;
        }

        const displayName = safeUser.username || 'Usuario';
        const message: ChatMessage = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          userId: safeUser.id,
          username: displayName,
          from: displayName,
          name: displayName,
          role: safeUser.role || 'user',
          image: getAvatarUrl(safeUser.image, safeUser.id, displayName),
          body: sanitizedBody.slice(0, 500),
          createAt: new Date().toISOString(),
        };

        messages.unshift(message);
        if (messages.length > MAX_MESSAGES) {
          messages.pop();
        }

        io.emit('chat:message', message);
      } catch (error) {
        console.error('Socket chat send error:', error);
        socket.emit('chat:error', { message: 'Error interno en el chat. Intenta nuevamente.' });
      }
    });

    // Handle user disconnect
    socket.on('chat:get-users-online', () => {
      socket.emit('chat:users-online', { count: ownerToSockets.size });
    });

    socket.on('disconnect', () => {
      // legacy removal
      connectedUsers.delete(socket.id);

      // Remove mapping socket -> owner
      const owner = socketToOwner.get(socket.id);
      if (owner) {
        socketToOwner.delete(socket.id);
        const set = ownerToSockets.get(owner);
        if (set) {
          set.delete(socket.id);
          if (set.size === 0) {
            ownerToSockets.delete(owner);
            // optional: remove bucket state to free memory
            buckets.delete(owner);
          } else {
            ownerToSockets.set(owner, set);
          }
        }
      }

      const usersOnlineCount = ownerToSockets.size;
      // Emit updated users online count to all clients (unique owners)
      io.emit('chat:users-online', { count: usersOnlineCount });
    });
  });
};
