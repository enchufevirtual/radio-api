"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerError = exports.errorHandler = exports.boomErrorHandler = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
const boomErrorHandler = (err, req, res, next) => {
    if (boom_1.default.isBoom(err)) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload);
    }
    else {
        next(err);
    }
};
exports.boomErrorHandler = boomErrorHandler;
const errorHandler = (err, req, res, next) => {
    if (!boom_1.default.isBoom(err)) {
        res.status(500).json({ message: err.message });
    }
    else {
        next();
    }
};
exports.errorHandler = errorHandler;
const multerError = (err, req, res, next) => {
    if (err && err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ type: 'file', message: 'El archivo excede el límite - (MAX 10MB)' });
        }
        return res.status(400).json({ type: 'file', message: err.message || 'Error al cargar el archivo' });
    }
    if (err && err.message === 'Invalid file type. Only JPG, JPEG, PNG, GIF, MP3 and WAV are allowed.') {
        return res.status(400).json({ type: 'file', message: err.message });
    }
    if (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
    return next();
};
exports.multerError = multerError;
//# sourceMappingURL=error.handler.js.map