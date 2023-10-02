import { Sequelize, DataTypes, Model } from "sequelize";
import { POST_TABLE, USER_TABLE } from "./constants";
import { PostModel, Models } from "types/types";

const PostSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  audio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nameAudio: {
    field: 'name_audio',
    type: DataTypes.STRING,
    allowNull: true
  },
  content: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  userId: {
    field: 'user_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    unique: false
  },
  createAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: DataTypes.NOW
  }
}

class Post extends Model<PostModel> {
  static associate(model: Models) {
    this.belongsTo(model.User, {
      as: 'user',
      foreignKey: 'userId'
    });
    this.hasMany(model.Comment, {
      as: 'comments',
      foreignKey: 'postId'
    })
  }
  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: POST_TABLE,
      modelName: 'Post',
      timestamps: false
    }
  }
}

export { POST_TABLE, PostSchema, Post };