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
exports.updatePost = exports.createPost = exports.getAudio = exports.getPosts = void 0;
const post_service_1 = require("../services/post.service");
const postService = new post_service_1.PostService();
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postService.find(req.query);
        res.json(posts);
    }
    catch (error) {
        next(error);
    }
});
exports.getPosts = getPosts;
const getAudio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const posts = yield postService.findOne({ id });
        res.json(posts);
    }
    catch (error) {
        next(error);
    }
});
exports.getAudio = getAudio;
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, userId } = req.body;
        const files = req.files;
        const newPost = yield postService.create({ content, files, userId });
        res.status(201).json(newPost);
    }
    catch (error) {
        next(error);
    }
});
exports.createPost = createPost;
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
    }
    catch (error) {
        next(error);
    }
});
exports.updatePost = updatePost;
//# sourceMappingURL=post.controller.js.map