"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNameAudio = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const uuid_1 = require("uuid");
const UPLOADS_DIR = node_path_1.default.resolve(__dirname, '..', 'public', 'uploads');
const createNameAudio = (req, res, next) => {
    // We check if there are any files in req.files
    const files = req.files;
    if (files && files.audio && (files.audio instanceof Array || files.audio instanceof Object)) {
        // We access the audio arrangement in req.files.audio
        const audioFiles = files.audio instanceof Array ? files.audio : [files.audio];
        // Rename audio files
        audioFiles.forEach(audioFile => {
            const oldPath = audioFile.path;
            const fileExtension = node_path_1.default.extname(audioFile.originalname);
            const newName = `audio_${(0, uuid_1.v4)()}${fileExtension}`;
            const newPath = node_path_1.default.join(UPLOADS_DIR, newName);
            // Rename the file
            node_fs_1.default.renameSync(oldPath, newPath);
            // Update the object with the new information from the file
            audioFile.filename = newName;
            audioFile.path = newPath;
        });
        // Aquí puedes realizar otras acciones con los archivos de audio si es necesario
        next();
    }
    else {
        next();
    }
};
exports.createNameAudio = createNameAudio;
//# sourceMappingURL=createNameAudio.js.map