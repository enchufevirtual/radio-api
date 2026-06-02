"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Social = exports.SocialSchema = exports.SOCIAL_TABLE = void 0;
const sequelize_1 = require("sequelize");
const constants_1 = require("./constants");
Object.defineProperty(exports, "SOCIAL_TABLE", { enumerable: true, get: function () { return constants_1.SOCIAL_TABLE; } });
const SocialSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    facebook: {
        type: sequelize_1.DataTypes.STRING
    },
    twitter: {
        type: sequelize_1.DataTypes.STRING
    },
    github: {
        type: sequelize_1.DataTypes.STRING
    },
    instagram: {
        type: sequelize_1.DataTypes.STRING
    },
    userId: {
        field: 'user_id',
        allowNull: true,
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: constants_1.USER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    createAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        field: 'create_at',
        defaultValue: sequelize_1.DataTypes.NOW
    }
};
exports.SocialSchema = SocialSchema;
class Social extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: "userId"
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: constants_1.SOCIAL_TABLE,
            modelName: 'Social',
            timestamps: false
        };
    }
}
exports.Social = Social;
//# sourceMappingURL=social.model.js.map