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
exports.setupSocketIO = exports.getUsersOnlineInfo = exports.getUsersOnlineCount = exports.emitUserImageUpdate = exports.ioServer = void 0;
const socket_io_1 = require("socket.io");
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const socketUtils_1 = require("./socketUtils");
const MAX_MESSAGES = 100;
const HISTORY_SIZE = 50;
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 30000;
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = INACTIVITY_TIMEOUT_MS / 2; // 15 minutes
const domPurify = (0, dompurify_1.default)(new jsdom_1.JSDOM('').window);
const messages = [];
// Solo contar usuarios REALES autenticados con userId
const userSockets = new Map(); // userId -> socketIds
const userLastActivity = new Map(); // userId -> last activity timestamp
const socketToUserId = new Map(); // socketId -> userId
const rateLimitBuckets = new Map();
// ============ Periodic Cleanup of Inactive Users ============
const cleanupInterval = setInterval(() => {
    const now = Date.now();
    const inactiveUsers = [];
    for (const [userId, lastActivity] of userLastActivity.entries()) {
        if (now - lastActivity > INACTIVITY_TIMEOUT_MS) {
            inactiveUsers.push(userId);
            // Disconnect all sockets for this user
            const sockets = userSockets.get(userId);
            if (sockets) {
                sockets.forEach((socketId) => {
                    const socket = exports.ioServer === null || exports.ioServer === void 0 ? void 0 : exports.ioServer.sockets.sockets.get(socketId);
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
exports.ioServer = null;
const emitUserImageUpdate = (userId, image) => {
    const updatedMessages = messages.filter((message) => message.userId === userId);
    if (updatedMessages.length > 0) {
        updatedMessages.forEach((message) => {
            message.image = (0, socketUtils_1.getAvatarUrl)(image, message.userId, message.username);
        });
    }
    if (exports.ioServer) {
        exports.ioServer.emit('chat:user-image-updated', { userId, avatarUrl: (0, socketUtils_1.getAvatarUrl)(image, userId, `user${userId}`) });
    }
};
exports.emitUserImageUpdate = emitUserImageUpdate;
/**
 * Get count of authenticated users currently online
 * @returns Number of unique users with active socket connections
 */
const getUsersOnlineCount = () => {
    return userSockets.size;
};
exports.getUsersOnlineCount = getUsersOnlineCount;
/**
 * Get detailed info about online users (for debugging)
 */
const getUsersOnlineInfo = () => {
    return Array.from(userSockets.entries()).map(([userId, sockets]) => ({
        userId,
        socketCount: sockets.size,
        inactiveMs: Date.now() - (userLastActivity.get(userId) || Date.now()),
    }));
};
exports.getUsersOnlineInfo = getUsersOnlineInfo;
const setupSocketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        }
    });
    exports.ioServer = io;
    // ============ Authentication Middleware ============
    // Only accept authenticated users with valid JWT
    io.use((socket, next) => {
        var _a;
        try {
            const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
            if (!token) {
                return next();
            }
            // Verify JWT
            const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
            if (!(payload === null || payload === void 0 ? void 0 : payload.id)) {
                return next(new Error('Token inválido'));
            }
            socket.data.userId = Number(payload.id);
            return next();
        }
        catch (err) {
            next(new Error(`Auth failed: ${err.message}`));
        }
    });
    // ============ Connection Handler ============
    io.on('connection', (socket) => {
        var _a;
        const userId = socket.data.userId;
        if (typeof userId === 'number') {
            const sockets = (_a = userSockets.get(userId)) !== null && _a !== void 0 ? _a : new Set();
            sockets.add(socket.id);
            userSockets.set(userId, sockets);
            socketToUserId.set(socket.id, userId);
            userLastActivity.set(userId, Date.now());
        }
        const usersOnlineCount = userSockets.size;
        if (typeof userId === 'number') {
            console.log(`[Chat] User ${userId} connected (socketId: ${socket.id}). Total authenticated users online: ${usersOnlineCount}`);
        }
        else {
            console.log(`[Chat] Guest connected (socketId: ${socket.id}). Total authenticated users online: ${usersOnlineCount}`);
        }
        // ============ Broadcast Updated User Count ============
        io.emit('chat:users-online', { count: usersOnlineCount });
        // ============ Send Chat History ============
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const history = [...messages].slice(0, HISTORY_SIZE).reverse();
                const userIds = Array.from(new Set(history.map((m) => m.userId))).filter(Boolean);
                if (userIds.length === 0) {
                    socket.emit('chat:history', history);
                    return;
                }
                const { sequelize } = yield Promise.resolve().then(() => __importStar(require('../libs/sequelize')));
                const users = yield sequelize.models.User.findAll({
                    where: { id: userIds },
                    attributes: ['id', 'image'],
                    raw: true
                });
                const userImages = {};
                users.forEach((u) => {
                    userImages[Number(u.id)] = u.image || null;
                });
                const mapped = (0, socketUtils_1.mapMessagesToUserImages)(history, userImages);
                socket.emit('chat:history', mapped);
            }
            catch (err) {
                console.error(`[Chat] Error loading history for user ${userId}:`, err);
                socket.emit('chat:history', [...messages].slice(0, HISTORY_SIZE).reverse());
            }
        }))();
        // ============ Handle Incoming Messages ============
        socket.on('chat:send', (payload) => __awaiter(void 0, void 0, void 0, function* () {
            var _b, _c;
            try {
                if (typeof userId !== 'number') {
                    socket.emit('chat:error', { message: 'Debes iniciar sesión para enviar mensajes.' });
                    return;
                }
                // Update last activity
                userLastActivity.set(userId, Date.now());
                // Validate payload
                if (!payload || typeof payload !== 'object') {
                    socket.emit('chat:error', { message: 'Formato de mensaje inválido.' });
                    return;
                }
                if (!((_b = payload.body) === null || _b === void 0 ? void 0 : _b.trim())) {
                    socket.emit('chat:error', { message: 'El mensaje no puede estar vacío.' });
                    return;
                }
                // ============ Rate Limiting ============
                const now = Date.now();
                const bucket = (_c = rateLimitBuckets.get(userId)) !== null && _c !== void 0 ? _c : { tokens: RATE_LIMIT_MAX, lastRefill: now };
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
                const { sequelize } = yield Promise.resolve().then(() => __importStar(require('../libs/sequelize')));
                const user = yield sequelize.models.User.findByPk(userId, {
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
                const safeUser = user;
                const displayName = safeUser.username || 'Usuario';
                const message = {
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    userId: safeUser.id,
                    username: displayName,
                    from: displayName,
                    name: displayName,
                    role: safeUser.role || 'user',
                    image: (0, socketUtils_1.getAvatarUrl)(safeUser.image, safeUser.id, displayName),
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
            }
            catch (error) {
                console.error(`[Chat] Error handling chat:send from user ${userId}:`, error);
                socket.emit('chat:error', { message: 'Error interno en el chat.' });
            }
        }));
        // ============ Handle Users Online Request ============
        socket.on('chat:get-users-online', () => {
            if (typeof userId === 'number') {
                userLastActivity.set(userId, Date.now());
                console.debug(`[Chat] User ${userId} requested users online count: ${userSockets.size}`);
            }
            else {
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
                    }
                    else {
                        // User still has other connections
                        console.log(`[Chat] Connection closed for user ${userId} (${sockets.size} connections remaining)`);
                    }
                }
            }
            else {
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
exports.setupSocketIO = setupSocketIO;
//# sourceMappingURL=setupSocketIO.js.map