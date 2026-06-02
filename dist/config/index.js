"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    env: process.env.NODE_ENV || 'development',
    isProd: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 4000,
    dbUrl: process.env.DATABASE_URL || '',
    frontendUrl: process.env.FRONTEND_URL || '',
    jwtSecret: process.env.JWT_SECRET || ''
};
exports.config = config;
//# sourceMappingURL=index.js.map