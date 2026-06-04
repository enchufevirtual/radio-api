"use strict";
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
exports.createImage = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const sharp_1 = __importDefault(require("sharp"));
const node_path_1 = __importDefault(require("node:path"));
const UPLOADS_DIR = node_path_1.default.resolve(__dirname, '..', 'public', 'uploads');
const createImage = (req, res, next) => {
    var _a, _b, _c;
    const request = req;
    const file = (_a = request.file) !== null && _a !== void 0 ? _a : (_c = (_b = request.files) === null || _b === void 0 ? void 0 : _b.image) === null || _c === void 0 ? void 0 : _c[0];
    if (!file)
        return next();
    if (!file.mimetype.startsWith('image/')) {
        node_fs_1.default.unlink(file.path, (err) => {
            if (err)
                return next(err);
            return res.status(400).json({ message: 'Debe subir una imagen válida.' });
        });
        return;
    }
    const { originalname, path: filePath } = file;
    const resizedFilename = `ev-${originalname}`;
    const image = node_path_1.default.resolve(UPLOADS_DIR, resizedFilename);
    (0, sharp_1.default)(filePath)
        .resize({ width: 110 })
        .toFile(image, (err, info) => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e;
        if (err)
            return next(err);
        try {
            yield node_fs_1.default.promises.unlink(filePath);
            const existsImagePath = node_path_1.default.join(UPLOADS_DIR, originalname.replace('.jpg', ''));
            const existsImage = yield node_fs_1.default.promises
                .stat(existsImagePath)
                .then(() => true)
                .catch(() => false);
            if (existsImage)
                yield node_fs_1.default.promises.rename(image, existsImagePath);
            file.filename = resizedFilename;
            request.file = file;
            if ((_e = (_d = request.files) === null || _d === void 0 ? void 0 : _d.image) === null || _e === void 0 ? void 0 : _e.length) {
                request.files.image[0] = file;
            }
            return next();
        }
        catch (err) {
            return next(err);
        }
    }));
};
exports.createImage = createImage;
//# sourceMappingURL=createImage.js.map