"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = exports.CommentSchema = exports.COMMENT_TABLE = void 0;
const sequelize_1 = require("sequelize");
const constants_1 = require("./constants");
Object.defineProperty(exports, "COMMENT_TABLE", { enumerable: true, get: function () { return constants_1.COMMENT_TABLE; } });
const CommentSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT
    },
    postId: {
        field: 'post_id',
        allowNull: true,
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: constants_1.POST_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        unique: false
    },
    createAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        field: 'create_at',
        defaultValue: sequelize_1.DataTypes.NOW
    }
};
exports.CommentSchema = CommentSchema;
class Comment extends sequelize_1.Model {
    static associate(model) {
        this.belongsTo(model.Post, {
            as: 'post',
            foreignKey: 'postId'
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: constants_1.COMMENT_TABLE,
            modelName: 'Comment',
            timestamps: false
        };
    }
}
exports.Comment = Comment;
//# sourceMappingURL=comment.model.js.map