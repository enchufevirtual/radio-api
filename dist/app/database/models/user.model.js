"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.USER_TABLE = exports.User = void 0;
const sequelize_1 = require("sequelize");
const constants_1 = require("./constants");
Object.defineProperty(exports, "USER_TABLE", { enumerable: true, get: function () { return constants_1.USER_TABLE; } });
const UserSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    email: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
        unique: true
    },
    name: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    role: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'user'
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
    },
    confirm: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: false
    },
    createAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        field: 'create_at',
        defaultValue: sequelize_1.DataTypes.NOW
    }
};
exports.UserSchema = UserSchema;
class User extends sequelize_1.Model {
    static associate(models) {
        this.hasOne(models.Social, {
            as: 'social',
            foreignKey: 'userId'
        }),
            this.hasOne(models.Chat, {
                as: 'chat',
                foreignKey: 'userId'
            });
        this.hasMany(models.Post, {
            as: 'posts',
            foreignKey: 'userId'
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: constants_1.USER_TABLE,
            modelName: 'User',
            timestamps: false
        };
    }
}
exports.User = User;
//# sourceMappingURL=user.model.js.map