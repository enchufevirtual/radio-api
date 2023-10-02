import { Sequelize, DataTypes, Model } from "sequelize";
import { COMMENT_TABLE, POST_TABLE } from "./constants";
import { CommentModel, Models } from "types/types";

const CommentSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  comment: {
    type: DataTypes.TEXT
  },
  postId: {
    field: 'post_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: POST_TABLE,
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

class Comment extends Model<CommentModel> {
  static associate(model: Models) {
    this.belongsTo(model.Post, {
      as: 'post',
      foreignKey: 'postId'
    });
  }
  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: COMMENT_TABLE,
      modelName: 'Comment',
      timestamps: false
    }
  }
}

export { COMMENT_TABLE, CommentSchema, Comment }