"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/gif', 'image/jpeg', 'image/jpg'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const storage = multer_1.default.diskStorage({
    destination: node_path_1.default.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        const originalName = node_path_1.default.basename(Buffer.from(file.originalname, 'latin1').toString('utf8'));
        const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniqueSuffix}-${safeName}`;
        cb(null, filename);
    }
});
const fileFilter = (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype) || ALLOWED_AUDIO_TYPES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPG, JPEG, PNG, GIF, MP3 and WAV are allowed.'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
}).fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]);
//# sourceMappingURL=upload.js.map