"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
const sequelize_1 = require("../../../libs/sequelize");
const getExistingImages_1 = require("../../../helpers/getExistingImages");
class ChatService {
    constructor() {
        this.chat = sequelize_1.sequelize.models.Chat;
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            const userMessages = yield this.chat.findAll({
                include: [
                    {
                        model: sequelize_1.sequelize.models.User,
                        as: 'user',
                        attributes: { exclude: ['password', 'token', 'confirm', 'role', 'createAt', 'description', 'email'] },
                    },
                ],
            });
            try {
                const existingImages = yield (0, getExistingImages_1.getExistingImages)();
                for (const message of userMessages) {
                    if (!existingImages.includes(message.user.image)) {
                        message.user.image = null;
                    }
                }
                return userMessages;
            }
            catch (err) {
                throw boom_1.default.badImplementation('Error al obtener las imágenes existentes');
            }
        });
    }
    create({ message, userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield sequelize_1.sequelize.models.User.findByPk(userId);
            if (userExists) {
                const newMessage = yield this.chat.create({ message, userId });
                return newMessage;
            }
            else {
                throw boom_1.default.notFound('Hubo error al crear mensaje');
            }
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map