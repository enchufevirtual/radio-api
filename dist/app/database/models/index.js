"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupModels = void 0;
const user_model_1 = require("./user.model");
const social_model_1 = require("./social.model");
const chat_model_1 = require("./chat.model");
const post_model_1 = require("./post.model");
const comment_model_1 = require("./comment.model");
const modelInstances = {
    User: user_model_1.User,
    Social: social_model_1.Social,
    Chat: chat_model_1.Chat,
    Post: post_model_1.Post,
    Comment: comment_model_1.Comment
};
const setupModels = (sequelize) => {
    user_model_1.User.init(user_model_1.UserSchema, user_model_1.User.config(sequelize));
    social_model_1.Social.init(social_model_1.SocialSchema, social_model_1.Social.config(sequelize));
    chat_model_1.Chat.init(chat_model_1.ChatSchema, chat_model_1.Chat.config(sequelize));
    post_model_1.Post.init(post_model_1.PostSchema, post_model_1.Post.config(sequelize));
    comment_model_1.Comment.init(comment_model_1.CommentSchema, comment_model_1.Comment.config(sequelize));
    user_model_1.User.associate(modelInstances);
    social_model_1.Social.associate(modelInstances);
    chat_model_1.Chat.associate(modelInstances);
    post_model_1.Post.associate(modelInstances);
    comment_model_1.Comment.associate(modelInstances);
};
exports.setupModels = setupModels;
//# sourceMappingURL=index.js.map