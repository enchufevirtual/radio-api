"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayFiles = void 0;
const arrayFiles = (files) => {
    let image = "";
    let audio = "";
    let nameAudio = "";
    const ALLOWED_IMAGES = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
    const ALLOWED_AUDIO = ["audio/mpeg", "audio/wav", "audio/mp3"];
    for (const fieldName in files) {
        if (Object.hasOwnProperty.call(files, fieldName)) {
            const fileArray = files[fieldName];
            // fileArray es un array que contiene la información de cada archivo del campo "fieldName"
            for (const file of fileArray) {
                if (ALLOWED_IMAGES.includes(file.mimetype)) {
                    image = file.filename;
                }
                else if (ALLOWED_AUDIO.includes(file.mimetype)) {
                    nameAudio = file.originalname;
                    audio = file.filename;
                }
            }
        }
    }
    return {
        image,
        audio,
        nameAudio
    };
};
exports.arrayFiles = arrayFiles;
//# sourceMappingURL=arrayFiles.js.map