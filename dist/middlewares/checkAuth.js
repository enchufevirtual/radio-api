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
exports.checkAuth = void 0;
const sequelize_1 = require("../libs/sequelize");
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
            req.userAuth = yield sequelize_1.sequelize.models.User.findByPk(parseInt(decoded.id), {
                attributes: { exclude: ['password', 'token', 'confirm'] },
                include: ['social']
            });
            return next();
        }
        catch (error) {
            const err = new Error('Invalid Token');
            return res.status(403).json({ message: err.message });
        }
    }
    if (!token) {
        const error = new Error('Invalid or non-existent token');
        return res.status(403).json({ message: error.message });
    }
    next();
});
exports.checkAuth = checkAuth;
//# sourceMappingURL=checkAuth.js.map