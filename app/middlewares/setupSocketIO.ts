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
  userId?: number;
}

const MAX_MESSAGES = 100;
const HISTORY_SIZE = 50;
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 30_000;
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = INACTIVITY_TIMEOUT_MS / 2; // 15 minutes

const domPurify = createDOMPurify(new JSDOM('').window as unknown as Window & typeof globalThis);
const messages: ChatMessage[] = [];

// Solo contar usuarios REALES autenticados con userId
const userSockets = new Map<number, Set<string>>(); // userId -> socketIds
const userLastActivity = new Map<number, number>(); // userId -> last activity timestamp
const socketToUserId = new Map<string, number>(); // socketId -> userId

// Rate limiting token-bucket per user
type Bucket = { tokens: number; lastRefill: number };
const rateLimitBuckets = new Map<number, Bucket>();

// ============ Periodic Cleanup of Inactive Users ============
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  const inactiveUsers: number[] = [];
  
  for (const [userId, lastActivity] of userLastActivity.entries()) {
    if (now - lastActivity > INACTIVITY_TIMEOUT_MS) {
      inactiveUsers.push(userId);
      
      // Disconnect all sockets for this user
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.forEach((socketId) => {
          const socket = ioServer?.sockets.sockets.get(socketId);
          if (socket) {
            console.log(`[Chat] Force disconnecting inactive user ${userId} (socketId: ${socketId})`);
            socket.disconnect(true);
          }
        });
      }
    }
  }
  
  // Remove inactive users from tracking
  inactiveUsers.forEach((userId) => {
    userSockets.delete(userId);
    userLastActivity.delete(userId);
    rateLimitBuckets.delete(userId);
  });
  
  if (inactiveUsers.length > 0) {
    console.log(`[Chat] Cleaned up ${inactiveUsers.length} inactive users. Active users: ${userSockets.size}`);
  }
}, CLEANUP_INTERVAL_MS);

export let ioServer: WebSocketsServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> | null = null;

export const emitUserImageUpdate = (userId: number, image: string | null) => {
  const updatedMessages = messages.filter((message) => message.userId === userId);
  if (updatedMessages.length > 0) {
    updatedMessages.forEach((message) => {
      message.image = getAvatarUrl(image, message.userId, message.username);
    });
  }
  if (ioServer) {
    console.log(`[Chat] Broadcasting image update for user ${userId}`);
    ioServer.emit('chat:user-image-updated', { userId, avatarUrl: getAvatarUrl(image, userId, `user${userId}`) });
  }
};

/**
 * Get count of authenticated users currently online
 * @returns Number of unique users with active socket connections
 */
export const getUsersOnlineCount = (): number => {
  return userSockets.size;
};

/**
 * Get detailed info about online users (for debugging)
 */
export const getUsersOnlineInfo = () => {
  return Array.from(userSockets.entries()).map(([userId, sockets]) => ({
    userId,
    socketCount: sockets.size,
    inactiveMs: Date.now() - (userLastActivity.get(userId) || Date.now()),
  }));
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

  console.log(`[Chat] Socket.io server initialized. CORS origin: ${process.env.FRONTEND_URL}`);

  // ============ Authentication Middleware ============
  // Only accept authenticated users with valid JWT
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next();
      }

      // Verify JWT
      const payload = jwt.verify(token, config.jwtSecret) as any;
      if (!payload?.id) {
        return next(new Error('Token inválido'));
      }

      socket.data.userId = Number(payload.id);
      console.debug(`[Chat] JWT verified for user ${socket.data.userId}`);
      return next();
    } catch (err: any) {
      console.error(`[Chat] Auth failed: ${err.message}`);
      next(new Error(`Auth failed: ${err.message}`));
    }
  });

  // ============ Connection Handler ============
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId as number | undefined;
    if (typeof userId === 'number') {
      const sockets = userSockets.get(userId) ?? new Set<string>();
      sockets.add(socket.id);
      userSockets.set(userId, sockets);
      socketToUserId.set(socket.id, userId);
      userLastActivity.set(userId, Date.now());
    }

    const usersOnlineCount = userSockets.size;
    if (typeof userId === 'number') {
      console.log(`[Chat] User ${userId} connected (socketId: ${socket.id}). Total authenticated users online: ${usersOnlineCount}`);
    } else {
      console.log(`[Chat] Guest connected (socketId: ${socket.id}). Total authenticated users online: ${usersOnlineCount}`);
    }

    // ============ Broadcast Updated User Count ============
    io.emit('chat:users-online', { count: usersOnlineCount });
    
    // ============ Send Chat History ============
    (async () => {
      try {
        const history = [...messages].slice(0, HISTORY_SIZE).reverse();
        const userIds = Array.from(new Set(history.map((m) => m.userId))).filter(Boolean);
        
        if (userIds.length === 0) {
          console.debug(`[Chat] Sending empty history to user ${userId}`);
          socket.emit('chat:history', history);
          return;
        }

        const { sequelize } = await import('../libs/sequelize');
        const users = await sequelize.models.User.findAll({
          where: { id: userIds },
          attributes: ['id', 'image'],
          raw: true
        });

        const userImages: Record<number, string | null> = {};
        users.forEach((u: any) => {
          userImages[Number(u.id)] = u.image || null;
        });

        const mapped = mapMessagesToUserImages(history, userImages);
        console.debug(`[Chat] Sending ${mapped.length} history messages to user ${userId}`);
        socket.emit('chat:history', mapped);
      } catch (err) {
        console.error(`[Chat] Error loading history for user ${userId}:`, err);
        socket.emit('chat:history', [...messages].slice(0, HISTORY_SIZE).reverse());
      }
    })();

    // ============ Handle Incoming Messages ============
    socket.on('chat:send', async (payload: ClientChatPayload) => {
      try {
        if (typeof userId !== 'number') {
          socket.emit('chat:error', { message: 'Debes iniciar sesión para enviar mensajes.' });
          return;
        }

        // Update last activity
        userLastActivity.set(userId, Date.now());

        // Validate payload
        if (!payload || typeof payload !== 'object') {
          console.warn(`[Chat] Invalid payload from user ${userId}`);
          socket.emit('chat:error', { message: 'Formato de mensaje inválido.' });
          return;
        }

        if (!payload.body?.trim()) {
          socket.emit('chat:error', { message: 'El mensaje no puede estar vacío.' });
          return;
        }

        // ============ Rate Limiting ============
        const now = Date.now();
        const bucket = rateLimitBuckets.get(userId) ?? { tokens: RATE_LIMIT_MAX, lastRefill: now };
        
        const elapsed = Math.max(0, now - bucket.lastRefill);
        const refill = (elapsed / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_MAX;
        bucket.tokens = Math.min(RATE_LIMIT_MAX, bucket.tokens + refill);
        bucket.lastRefill = now;

        if (bucket.tokens < 1) {
          rateLimitBuckets.set(userId, bucket);
          console.warn(`[Chat] Rate limit exceeded for user ${userId}`);
          socket.emit('chat:error', { message: 'Has superado el límite de mensajes. Espera unos segundos.' });
          return;
        }
        bucket.tokens -= 1;
        rateLimitBuckets.set(userId, bucket);

        // ============ Fetch User Data ============
        const { sequelize } = await import('../libs/sequelize');
        const user = await sequelize.models.User.findByPk(userId, {
          attributes: ['id', 'username', 'role', 'image'],
          raw: true
        });

        if (!user) {
          console.error(`[Chat] User ${userId} not found in database`);
          socket.emit('chat:error', { message: 'Usuario no encontrado.' });
          return;
        }

        // ============ Sanitize Message ============
        const sanitizedBody = domPurify.sanitize(payload.body, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: []
        }).trim().slice(0, 500);

        const safeUser = user as unknown as { id: number; username: string; role: string; image: string | null };
        const displayName = safeUser.username || 'Usuario';

        const message: ChatMessage = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          userId: safeUser.id,
          username: displayName,
          from: displayName,
          name: displayName,
          role: safeUser.role || 'user',
          image: getAvatarUrl(safeUser.image, safeUser.id, displayName),
          body: sanitizedBody,
          createAt: new Date().toISOString(),
        };

        // Store message (newest first)
        messages.unshift(message);
        if (messages.length > MAX_MESSAGES) {
          messages.pop();
        }

        console.debug(`[Chat] Message from user ${userId}: "${sanitizedBody.substring(0, 50)}..."`);
        io.emit('chat:message', message);
      } catch (error) {
        console.error(`[Chat] Error handling chat:send from user ${userId}:`, error);
        socket.emit('chat:error', { message: 'Error interno en el chat.' });
      }
    });

    // ============ Handle Users Online Request ============
    socket.on('chat:get-users-online', () => {
      if (typeof userId === 'number') {
        userLastActivity.set(userId, Date.now());
        console.debug(`[Chat] User ${userId} requested users online count: ${userSockets.size}`);
      } else {
        console.debug(`[Chat] Guest requested users online count: ${userSockets.size}`);
      }
      socket.emit('chat:users-online', { count: userSockets.size });
    });

    // ============ Disconnect Handler ============
    socket.on('disconnect', () => {
      if (typeof userId === 'number') {
        const sockets = userSockets.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            // User completely offline
            userSockets.delete(userId);
            userLastActivity.delete(userId);
            rateLimitBuckets.delete(userId);
            console.log(`[Chat] User ${userId} fully disconnected. Total authenticated users online: ${userSockets.size}`);
          } else {
            // User still has other connections
            console.log(`[Chat] Connection closed for user ${userId} (${sockets.size} connections remaining)`);
          }
        }
      } else {
        console.log(`[Chat] Guest disconnected (socketId: ${socket.id})`);
      }

      socketToUserId.delete(socket.id);
      
      // Broadcast updated user count
      io.emit('chat:users-online', { count: userSockets.size });
    });
  });

  // Cleanup on server shutdown
  process.on('SIGTERM', () => {
    console.log('[Chat] Server shutting down, clearing cleanup interval');
    clearInterval(cleanupInterval);
  });
};
