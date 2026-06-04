"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controller/post.controller");
const createNameAudio_1 = require("../../../middlewares/createNameAudio");
const router = express_1.default.Router();
router.route('/').get(post_controller_1.getPosts).post(createNameAudio_1.createNameAudio, post_controller_1.createPost);
exports.default = router;
//# sourceMappingURL=post.routes.js.map