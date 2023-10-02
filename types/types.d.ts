import { Request } from 'express';
import { Social } from '../app/database/models/social.model';
import { User } from '../app/database/models/user.model';
import { Chat } from '../app/database/models/chat.model';
import { Post } from '../app/database/models/post.model';
import { Comment } from '../app/database/models/comment.model';
import { Optional, DataTypes } from 'sequelize';

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  description: string;
  image: string;
  token: string;
  confirm: boolean
  social?: {
    facebook?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
  role?: string;
  createAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt'> {}

export interface Models {
  User: typeof User;
  Social: typeof Social;
  Chat: typeof Chat;
  Post: typeof Post;
  Comment: typeof Comment;
}

interface SocialModel {
  id: {
    allowNull: boolean,
    autoIncrement: boolean,
    primaryKey: boolean,
    type: DataTypes.INTEGER,
  },
  facebook: {
    type: DataTypes.STRING
  },
  twitter: {
    type: DataTypes.STRING
  },
  github: {
    type: DataTypes.STRING
  },
  instagram: {
    type: DataTypes.STRING
  }
}

interface PostModel {
  id: {
    allowNull: boolean,
    autoIncrement: boolean,
    primaryKey: boolean,
    type: DataTypes.INTEGER,
  },
  image: {
    type: DataTypes.STRING
  },
  audio: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.STRING
  }
}

interface CommentModel {
  id: {
    allowNull: boolean,
    autoIncrement: boolean,
    primaryKey: boolean,
    type: DataTypes.INTEGER,
  },
  comment: {
    type: DataTypes.STRING
  }
}

interface ChatModel {
  id: {
    allowNull: boolean,
    autoIncrement: boolean,
    primaryKey: boolean,
    type: DataTypes.INTEGER,
  },
  message: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.STRING
  }
}

export interface RequestWithUser extends Request {
  userAuth?: any
}

export interface Data {
  email: string,
  name: string,
  description: string,
  password: string,
  token: string,
  confirm: boolean,
  image?: string,
  social?: object,
  role?: string
}

export type Files = {
  [fieldname: string]: Express.Multer.File[];
} | Express.Multer.File[] | undefined 

export interface UpdateData {
  id: number | string,
  authId: number | string,
  name?: string,
  username?: string,
  email?: string,
  description?: string,
  social: string
  file?: Files
}

export interface Errors {
  errors: [
    {
      message: string
      type: string,
      value: string,
      origin: string,
    }
  ]
  message: string,
  name: string,
}

export interface ClientMessageData {
  body: string;
  userId: number;
  from: string;
  image: string;
  name: string,
  createAt: Date;
}

export interface QueryParams {
  limit?: number;
  offset?: number;
}