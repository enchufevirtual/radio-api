"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExistingImages = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const imageFolder = node_path_1.default.resolve(__dirname, '../public/uploads');
function getExistingImages() {
    return new Promise((resolve, reject) => {
        node_fs_1.default.readdir(imageFolder, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(files);
            }
        });
    });
}
exports.getExistingImages = getExistingImages;
//# sourceMappingURL=getExistingImages.js.map