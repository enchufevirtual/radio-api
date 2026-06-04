"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.ChatSchema = exports.CHAT_TABLE = void 0;
const sequelize_1 = require("sequelize");
const constants_1 = require("./constants");
Object.defineProperty(exports, "CHAT_TABLE", { enumerable: true, get: function () { return constants_1.CHAT_TABLE; } });
const ChatSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT
    },
    image: {
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
        onDelete: 'CASCADE',
        unique: false,
    },
    createAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        field: 'create_at',
        defaultValue: sequelize_1.DataTypes.NOW
    }
};
exports.ChatSchema = ChatSchema;
class Chat extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: "userId"
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: constants_1.CHAT_TABLE,
            modelName: 'Chat',
            timestamps: false
        };
    }
}
exports.Chat = Chat;
//# sourceMappingURL=chat.model.js.map