const { Model, DataTypes } = require("sequelize");

const SOCIAL_TABLE = 'social';

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
  createAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: DataTypes.NOW
  }
}

class Social extends Model {

  static associate(models) {
    this.hasOne(models.Admin, {
      as: 'admin',
      foreignKey: "socialId"
    });
    this.hasOne(models.User, {
      as: 'user',
      foreignKey: "socialId"
    })
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: SOCIAL_TABLE,
      modelName: 'Social',
      timestamps: false
    }
  }
}

module.exports = { SOCIAL_TABLE, SocialSchema, Social }