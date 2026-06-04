"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerApi = void 0;
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./users/routes/user.routes"));
const chat_routes_1 = __importDefault(require("./chat/routes/chat.routes"));
const radio_routes_1 = __importDefault(require("./radio/routes/radio.routes"));
const post_routes_1 = __importDefault(require("./posts/routes/post.routes"));
const routerApi = (app) => {
    const router = express_1.default.Router();
    app.use('/api/radio/v1', router);
    router.use('/users', user_routes_1.default);
    router.use('/chat', chat_routes_1.default);
    router.use('/zeno', radio_routes_1.default);
    router.use('/posts', post_routes_1.default);
};
exports.routerApi = routerApi;
//# sourceMappingURL=index.js.map