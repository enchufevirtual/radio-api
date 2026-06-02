"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.PostSchema = exports.POST_TABLE = void 0;
const sequelize_1 = require("sequelize");
const constants_1 = require("./constants");
Object.defineProperty(exports, "POST_TABLE", { enumerable: true, get: function () { return constants_1.POST_TABLE; } });
const PostSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    audio: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    nameAudio: {
        field: 'name_audio',
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    content: {
        allowNull: false,
        type: sequelize_1.DataTypes.TEXT
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
        unique: false
    },
    createAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        field: 'create_at',
        defaultValue: sequelize_1.DataTypes.NOW
    }
};
exports.PostSchema = PostSchema;
class Post extends sequelize_1.Model {
    static associate(model) {
        this.belongsTo(model.User, {
            as: 'user',
            foreignKey: 'userId'
        });
        this.hasMany(model.Comment, {
            as: 'comments',
            foreignKey: 'postId'
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: constants_1.POST_TABLE,
            modelName: 'Post',
            timestamps: false
        };
    }
}
exports.Post = Post;
//# sourceMappingURL=post.model.js.map