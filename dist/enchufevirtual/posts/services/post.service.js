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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const arrayFiles_1 = require("../../../helpers/arrayFiles");
const sanitizeText_1 = require("../../../helpers/sanitizeText");
const sequelize_1 = require("../../../libs/sequelize");
class PostService {
    constructor() {
        this.post = sequelize_1.sequelize.models.Post;
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                include: [
                    {
                        model: sequelize_1.sequelize.models.Comment,
                        as: 'comments',
                    },
                    {
                        model: sequelize_1.sequelize.models.User,
                        as: 'user',
                        attributes: ['image', 'name', 'username']
                    }
                ],
                order: [['id', 'DESC']]
            };
            const { limit } = query;
            if (limit) {
                options.limit = Number(limit);
            }
            // const totalCount = await this.post.count();
            const posts = yield this.post.findAll(options);
            // const hasMoreResults = totalCount > (Number(offset) + posts.length);
            return { posts };
        });
    }
    findOne({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const audio = yield this.post.findByPk(id);
            // eslint-disable-next-line no-console
            console.log(audio);
        });
    }
    create({ content, files, userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizedContent = (0, sanitizeText_1.sanitizeText)(content !== null && content !== void 0 ? content : '', 1000);
            const { image, audio, nameAudio } = (0, arrayFiles_1.arrayFiles)(files);
            const createPost = yield this.post.create({
                content: sanitizedContent,
                image: image !== null && image !== void 0 ? image : "",
                audio: audio !== null && audio !== void 0 ? audio : "",
                nameAudio: nameAudio !== null && nameAudio !== void 0 ? nameAudio : "",
                userId
            });
            return createPost;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map