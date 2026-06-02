"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDataSchema = exports.createUserSchema = exports.getUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const name = joi_1.default.string().min(5).max(15);
const email = joi_1.default.string().email();
const password = joi_1.default.string();
const description = joi_1.default.string().min(10);
const role = joi_1.default.string().min(5);
const social = joi_1.default.object({
    facebook: joi_1.default.string().min(15).max(50),
    twitter: joi_1.default.string().min(15).max(50),
    instagram: joi_1.default.string().min(15).max(50),
    github: joi_1.default.string().min(15).max(50),
});
const image = joi_1.default.string().regex(/.(jpg|jpeg|png|gif)$/);
const getUserSchema = joi_1.default.object({ username: joi_1.default.string() });
exports.getUserSchema = getUserSchema;
const createUserSchema = joi_1.default.object({
    name: name,
    email: email,
    password: password,
    description: description,
    role: role,
    image: image
});
exports.createUserSchema = createUserSchema;
const updateUserDataSchema = joi_1.default.object({
    name: name,
    email: email,
    description: description,
    social: social,
    image: image
});
exports.updateUserDataSchema = updateUserDataSchema;
//# sourceMappingURL=user.schema.js.map