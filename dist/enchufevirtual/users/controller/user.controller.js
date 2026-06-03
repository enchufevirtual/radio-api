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
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.updateUserPassword = exports.newPasswordUser = exports.checkTokenUser = exports.forgetPasswordUser = exports.confirmUser = exports.deleteUser = exports.updateUser = exports.createUser = exports.authenticateUser = exports.getUser = exports.getUsers = void 0;
const user_service_1 = require("../services/user.service");
const generateJWT_1 = require("../../..//helpers/generateJWT");
const getExistingImages_1 = require("../../../helpers/getExistingImages");
const service = new user_service_1.UserService();
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield service.find();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const user = yield service.findUser(username);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAuth } = req;
    try {
        const existingImages = yield (0, getExistingImages_1.getExistingImages)();
        if (!existingImages.includes(userAuth.image)) {
            userAuth.image = null;
        }
        res.json(userAuth);
    }
    catch (err) {
        res.status(500).json({ error: 'Error al obtener las imágenes existentes' });
    }
});
exports.profile = profile;
const confirmUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        yield service.confirm(token);
        res.json({ message: 'El Usuario ha sido confirmado' });
    }
    catch (error) {
        next(error);
    }
});
exports.confirmUser = confirmUser;
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const authUser = yield service.authenticate(email, password);
        res.json({
            id: authUser.id,
            name: authUser.name,
            email: authUser.email,
            image: authUser.image,
            token: (0, generateJWT_1.generateJWT)(authUser.id),
            role: authUser.role
        });
    }
    catch (error) {
        next(error);
    }
});
exports.authenticateUser = authenticateUser;
const forgetPasswordUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield service.forgetPassword(email);
        res.json({ message: '¡Gracias por contactarnos! Hemos enviado un correo electrónico con las instrucciones necesarias.' });
    }
    catch (error) {
        next(error);
    }
});
exports.forgetPasswordUser = forgetPasswordUser;
const checkTokenUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        yield service.checkToken(token);
        res.json({ message: 'Token Válido' });
    }
    catch (error) {
        next(error);
    }
});
exports.checkTokenUser = checkTokenUser;
const newPasswordUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        yield service.newPassword(token, password);
        res.json({ message: 'Password Modificado Correctamente' });
    }
    catch (error) {
        next(error);
    }
});
exports.newPasswordUser = newPasswordUser;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { username, name, email, password } = req.body;
        const finalUsername = username || name;
        const files = req.files;
        const image = (_b = (_a = files === null || files === void 0 ? void 0 : files.image) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : req.file;
        const newUser = yield service.create({ username: finalUsername, email, password, image });
        res.status(201).json(newUser);
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userAuth } = req;
        const file = req.files;
        const { name, username, email, description, social } = req.body;
        const newData = yield service.update({ id, authId: userAuth.id, name, username, email, description, social, file });
        res.json(newData);
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAuth } = req;
        const { password, new_password } = req.body;
        yield service.updatePassword({ id: userAuth.id, password, new_password });
        res.json({ message: 'Password cambiado correctamente' });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserPassword = updateUserPassword;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userAuth } = req;
        const rta = yield service.delete(id, userAuth.id);
        res.json(rta);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map