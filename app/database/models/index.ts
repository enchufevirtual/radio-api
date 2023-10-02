
import { User, UserSchema } from "./user.model";
import { Social, SocialSchema } from "./social.model";
import { Chat, ChatSchema } from "./chat.model";
import { Post, PostSchema } from "./post.model";
import { Comment, CommentSchema } from "./comment.model";
import { Sequelize } from "sequelize";

const modelInstances = {
  User,
  Social,
  Chat, 
  Post,
  Comment
};

const setupModels = (sequelize: Sequelize) => {
  User.init(UserSchema, User.config(sequelize));
  Social.init(SocialSchema, Social.config(sequelize));
  Chat.init(ChatSchema, Chat.config(sequelize));
  Post.init(PostSchema, Post.config(sequelize));
  Comment.init(CommentSchema, Comment.config(sequelize));

  User.associate(modelInstances);
  Social.associate(modelInstances);
  Chat.associate(modelInstances);
  Post.associate(modelInstances);
  Comment.associate(modelInstances);
}

export{ setupModels };