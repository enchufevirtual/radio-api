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
exports.UserService = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
const sequelize_1 = require("../../../libs/sequelize");
const social_service_1 = require("../../social/social.service");
const hashPassword_1 = require("../../../helpers/hashPassword");
const generateId_1 = require("../../../helpers/generateId");
const types_1 = require("./types");
const auth_1 = require("../../../helpers/auth");
const resetPassword_1 = require("../../../helpers/resetPassword");
const emailRegister_1 = require("../../../helpers/emailRegister");
const getExistingImages_1 = require("../../../helpers/getExistingImages");
const arrayFiles_1 = require("../../../helpers/arrayFiles");
const socialService = new social_service_1.SocialService();
class UserService {
    constructor() {
        this.user = sequelize_1.sequelize.models.User;
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.user.findAll({
                include: ['social']
            });
            return users;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findByPk(id, {
                // attributes: { exclude: ['password', 'confirm', 'token'] },
                include: ['social']
            });
            if (!user) {
                throw boom_1.default.notFound('User Not Found');
            }
            return user;
        });
    }
    findOneProperty(property) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyFound = yield this.user.findOne({ where: property, include: ['social'] });
            return propertyFound || null;
        });
    }
    findUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const strUsername = String(username);
            if (!isNaN(Number(strUsername))) {
                const user = yield this.findById(Number(strUsername));
                if (user) {
                    const existingImages = yield (0, getExistingImages_1.getExistingImages)();
                    if (!existingImages.includes(user.image)) {
                        user.image = '';
                    }
                    return user;
                }
            }
            const user = yield this.findOneProperty({ username: strUsername });
            if (user) {
                const existingImages = yield (0, getExistingImages_1.getExistingImages)();
                if (!existingImages.includes(user.image)) {
                    user.image = '';
                }
                return user;
            }
            throw boom_1.default.notFound('User Not Found');
        });
    }
    confirm(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userConfirm = yield this.findOneProperty({ token });
                userConfirm.token = null;
                userConfirm.confirm = true;
                yield userConfirm.save();
            }
            catch (error) {
                throw boom_1.default.notFound('Este token no es válido');
            }
        });
    }
    authenticate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // User Exists
            const userExists = yield this.findOneProperty({ email });
            // User it's not exists
            if (!userExists) {
                throw boom_1.default.notFound('Esta cuenta no existe');
            }
            // User is confirmed
            if (userExists.confirm == types_1.Status.PENDING) {
                throw boom_1.default.notFound('Tu cuenta no ha sido confirmada');
            }
            // Check Password
            if (yield (0, auth_1.auth)(password, userExists.password)) {
                // Authenticate
                return userExists;
            }
            else {
                throw boom_1.default.notFound('Lo siento, la contraseña que ha ingresado no es correcta.');
            }
        });
    }
    forgetPassword(verifyEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findOneProperty({ email: verifyEmail });
            if (!user)
                throw boom_1.default.notFound('Este usuario no existe');
            user.token = (0, generateId_1.generateId)();
            yield user.save();
            const { name, email, token } = user;
            try {
                yield (0, resetPassword_1.resetPassword)({ name, email, token });
            }
            catch (error) {
                user.token = null;
                yield user.save();
                throw error;
            }
        });
    }
    checkToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const existsToken = yield this.findOneProperty({ token });
            if (!existsToken)
                throw boom_1.default.notFound('Este Token no es válido');
        });
    }
    newPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
            const user = yield this.findOneProperty({ token });
            user.token = null;
            user.password = hashedPassword;
            yield user.save();
        });
    }
    create({ username, email, password, image }) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
            const userExists = yield this.findOneProperty({ email });
            const userNameExists = yield this.findOneProperty({ username });
            if (userNameExists)
                throw boom_1.default.conflict(`${username} ya está registrado`);
            if (userExists)
                throw boom_1.default.conflict('Este correo ya está registrado');
            const newUser = yield this.user.create({
                name: username,
                username: username.toLowerCase(),
                email,
                password: hashedPassword,
                token: (0, generateId_1.generateId)(),
                image: image ? image.filename : null
            }, {
                include: ['social']
            });
            const { token } = newUser;
            try {
                yield (0, emailRegister_1.emailRegister)({ name: username, email, token });
            }
            catch (error) {
                yield newUser.destroy();
                throw error;
            }
            return newUser;
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let imageFile = '';
            if (data.file) {
                const { image } = (0, arrayFiles_1.arrayFiles)(data.file);
                imageFile = image;
            }
            const user = yield this.findById(data.id);
            if (Number(user.id) !== Number(data.authId)) {
                throw boom_1.default.notFound('Esta acción no está permitida');
            }
            if (data.email && user.email !== data.email) {
                const userExists = yield this.findOneProperty({ email: data.email });
                if (userExists)
                    throw boom_1.default.conflict('Este correo ya está registrado');
            }
            const userData = {
                name: data.name,
                email: data.email,
                description: data.description,
                social: JSON.parse(data.social)
            };
            if (data.username && user.username !== data.username) {
                const username = yield this.findOneProperty({ username: data.username });
                if (!username) {
                    userData['username'] = data.username;
                }
                else {
                    userData['username'] = username;
                    throw boom_1.default.conflict('Este nombre de usuario no está disponible.');
                }
            }
            if (!imageFile) {
                const existingImages = yield (0, getExistingImages_1.getExistingImages)();
                if (!existingImages.includes(user.image)) {
                    imageFile = '';
                }
                else {
                    imageFile = user.image; // Keep the user's existing image
                }
            }
            else {
                const existingImages = yield (0, getExistingImages_1.getExistingImages)();
                if (!existingImages.includes(imageFile)) {
                    imageFile = '';
                }
            }
            userData['image'] = imageFile;
            const rta = yield user.update(userData);
            if (data.social) {
                yield socialService.update(Number(data.id), JSON.parse(data.social));
            }
            return rta;
        });
    }
    updatePassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield (0, hashPassword_1.hashPassword)(data.new_password);
            const { id, password } = data;
            const userExists = yield this.findById(id);
            if (!userExists)
                throw boom_1.default.conflict('Hubo un error');
            const existsPassword = this.findOneProperty({ password });
            if (!existsPassword)
                throw boom_1.default.conflict('El password actual es incorrecto');
            // Check Password
            if (yield (0, auth_1.auth)(password, userExists.password)) {
                // Authenticate
                userExists.password = hashedPassword;
                userExists.save();
            }
            else {
                throw boom_1.default.notFound('Lo siento, la contraseña que ha ingresado no es correcta.');
            }
        });
    }
    delete(id, authId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findById(id);
            if (user.id != authId) {
                throw boom_1.default.notFound('Esta acción no está permitida');
            }
            yield user.destroy();
            return { id };
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map