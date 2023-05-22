import { Model, Sequelize, DataTypes } from "sequelize";
import { SOCIAL_TABLE, USER_TABLE } from "./constants";
import { Models, SocialModel } from "types/types";

const SocialSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
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
    onDelete: 'CASCADE'
  },
  createAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: DataTypes.NOW
  }
}

class Social extends Model<SocialModel> {

  static associate(models: Models) {
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: "userId"
    })
  }
  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: SOCIAL_TABLE,
      modelName: 'Social',
      timestamps: false
    }
  }
}

export { SOCIAL_TABLE, SocialSchema, Social }