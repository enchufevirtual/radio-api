const { Model, DataTypes } = require("sequelize");
const { SOCIAL_TABLE } = require("./social.model.js");

const ADMIN_TABLE = 'admin';

const AdminSchema = {
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
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  description: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  image: {
    allowNull: false,
    type: DataTypes.STRING
  },
  socialId: {
    field: 'social_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: SOCIAL_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  createAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: DataTypes.NOW
  }
}

class Admin extends Model {
  static associate(models) {
    this.belongsTo(models.Social, {
      as: 'social',
      foreignKey: 'socialId'
    })
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: ADMIN_TABLE,
      modelName: 'Admin',
      timestamps: false
    }
  }
}

module.exports = { Admin, ADMIN_TABLE, AdminSchema };