"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth = (verifyPassword, password) => {
    return bcrypt_1.default.compare(verifyPassword, password);
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map