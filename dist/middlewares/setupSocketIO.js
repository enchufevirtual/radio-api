"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
const MAX_MESSAGES = 100;
const HISTORY_SIZE = 50;
const RATE_LIMIT_WINDOW_MS = 30000;
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_CLEANUP_MS = 60000; // Cleanup old entries every 1 minute
const domPurify = (0, dompurify_1.default)(new jsdom_1.JSDOM('').window);
const messages = [];
const userRateLimits = new Map();
const connectedUsers = new Set(); // Track connected socket IDs
// Cleanup old rate limit entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [userId, timestamps] of userRateLimits.entries()) {
        const windowed = timestamps.filter((ts) => now - ts <= RATE_LIMIT_WINDOW_MS);
        if (windowed.length === 0) {
            userRateLimits.delete(userId);
        }
        else {
            userRateLimits.set(userId, windowed);
        }
    }
}, RATE_LIMIT_CLEANUP_MS);
const setupSocketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        }
    });
    io.on('connection', (socket) => {
        // Track new connection
        connectedUsers.add(socket.id);
        const usersOnlineCount = connectedUsers.size;
        // Emit users online count to all clients
        io.emit('chat:users-online', { count: usersOnlineCount });
        socket.on('error', (error) => {
            socket.emit('chat:error', { message: error.message });
        });
        socket.emit('chat:history', [...messages].slice(0, HISTORY_SIZE).reverse());
        socket.on('chat:send', (payload) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                const userId = Number(payload.userId);
                if (!userId || !payload.body) {
                    socket.emit('chat:error', { message: 'Datos de usuario inválidos o mensaje vacío.' });
                    return;
                }
                const now = Date.now();
                const timestamps = (_a = userRateLimits.get(userId)) !== null && _a !== void 0 ? _a : [];
                const windowed = timestamps.filter((ts) => now - ts <= RATE_LIMIT_WINDOW_MS);
                if (windowed.length >= RATE_LIMIT_MAX) {
                    socket.emit('chat:error', { message: 'Has superado el límite de mensajes. Espera unos segundos.' });
                    userRateLimits.set(userId, windowed);
                    return;
                }
                windowed.push(now);
                userRateLimits.set(userId, windowed);
                const { sequelize } = yield Promise.resolve().then(() => __importStar(require('../libs/sequelize')));
                const user = yield sequelize.models.User.findByPk(userId, {
                    attributes: ['id', 'username', 'role', 'image']
                });
                if (!user) {
                    socket.emit('chat:error', { message: 'Usuario no encontrado.' });
                    return;
                }
                const safeUser = user;
                const sanitizedBody = domPurify.sanitize(payload.body, {
                    ALLOWED_TAGS: [],
                    ALLOWED_ATTR: []
                }).trim();
                if (!sanitizedBody) {
                    socket.emit('chat:error', { message: 'El mensaje no puede estar vacío.' });
                    return;
                }
                const message = {
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
            }
            catch (error) {
                console.error('Socket chat send error:', error);
                socket.emit('chat:error', { message: 'Error interno en el chat. Intenta nuevamente.' });
            }
        }));
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
exports.setupSocketIO = setupSocketIO;
//# sourceMappingURL=setupSocketIO.js.map