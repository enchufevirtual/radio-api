import { Model, Sequelize, DataTypes } from "sequelize";
import { CHAT_TABLE, USER_TABLE } from "./constants";
import { Models, ChatModel } from "types/types";

const ChatSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  message: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.STRING
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
    unique: false,
  },
  createAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: DataTypes.NOW
  }
}

class Chat extends Model<ChatModel> {

  static associate(models: Models) {
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: "userId"
    })
  }
  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: CHAT_TABLE,
      modelName: 'Chat',
      timestamps: false
    }
  }
}

export { CHAT_TABLE, ChatSchema, Chat }