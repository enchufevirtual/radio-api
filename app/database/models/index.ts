
import { User, UserSchema } from "./user.model";
import { Social, SocialSchema } from "./social.model";
import { Chat, ChatSchema } from "./chat.model";
import { Sequelize } from "sequelize";

const modelInstances = {
  User,
  Social,
  Chat
};

const setupModels = (sequelize: Sequelize) => {
  User.init(UserSchema, User.config(sequelize));
  Social.init(SocialSchema, Social.config(sequelize));
  Chat.init(ChatSchema, Chat.config(sequelize));

  User.associate(modelInstances);
  Social.associate(modelInstances);
  Chat.associate(modelInstances);
}

export{ setupModels };