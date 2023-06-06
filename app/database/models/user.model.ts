import { Model, Sequelize, DataTypes } from "sequelize";
import { USER_TABLE } from "./constants";
import { UserCreationAttributes, Models, UserAttributes } from "types/types";

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'user'
  },
  token: {
    type: DataTypes.STRING,
  },  
  confirm: {
    type: DataTypes.STRING,
    defaultValue: false
  },
  createAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: DataTypes.NOW
  }
}

class User extends Model<UserAttributes, UserCreationAttributes> {

  static associate(models: Models) {
    this.hasOne(models.Social, {
      as: 'social',
      foreignKey: 'userId'
    }),
    this.hasOne(models.Chat, {
      as: 'chat',
      foreignKey: 'userId'
    }) 
  }
  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
  
}

export { User, USER_TABLE, UserSchema }