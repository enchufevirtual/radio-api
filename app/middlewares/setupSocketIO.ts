import { Server as WebSocketsServer, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import * as http from 'http';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

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
const connectedUsers = new Set<string>(); // Track connected socket IDs

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

export const setupSocketIO = (server: http.Server) => {
  const io = new WebSocketsServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    }
  });

  io.on('connection', (socket: Socket) => {
    // Track new connection
    connectedUsers.add(socket.id);
    const usersOnlineCount = connectedUsers.size;
    
    // Emit users online count to all clients
    io.emit('chat:users-online', { count: usersOnlineCount });
    
    socket.on('error', (error: Error) => {
      socket.emit('chat:error', { message: error.message });
    });

    socket.emit('chat:history', [...messages].slice(0, HISTORY_SIZE).reverse());

    socket.on('chat:send', async (payload: ClientChatPayload) => {
      try {
        const userId = Number(payload.userId);
        if (!userId || !payload.body) {
          socket.emit('chat:error', { message: 'Datos de usuario inválidos o mensaje vacío.' });
          return;
        }

        const now = Date.now();
        const timestamps = userRateLimits.get(userId) ?? [];
        const windowed = timestamps.filter((ts) => now - ts <= RATE_LIMIT_WINDOW_MS);

        if (windowed.length >= RATE_LIMIT_MAX) {
          socket.emit('chat:error', { message: 'Has superado el límite de mensajes. Espera unos segundos.' });
          userRateLimits.set(userId, windowed);
          return;
        }

        windowed.push(now);
        userRateLimits.set(userId, windowed);

        const { sequelize } = await import('../libs/sequelize');
        const user = await sequelize.models.User.findByPk(userId, {
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

        const message: ChatMessage = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          userId: safeUser.id,
          username: safeUser.username || 'Usuario',
          from: safeUser.username || 'Usuario',
          name: safeUser.username || 'Usuario',
          role: safeUser.role || 'user',
          image: safeUser.image || null,
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
      socket.emit('chat:users-online', { count: connectedUsers.size });
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);
      const usersOnlineCount = connectedUsers.size;
      // Emit updated users online count to all clients
      io.emit('chat:users-online', { count: usersOnlineCount });
    });
  });
};
