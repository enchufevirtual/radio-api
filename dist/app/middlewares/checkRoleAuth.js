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
exports.checkRoleAuth = void 0;
const checkRoleAuth = (roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAuth } = req;
    try {
        if (userAuth && roles.some(role => role === userAuth.role)) {
            next();
        }
        else {
            res.status(409).json({ message: 'No tienes los permisos' });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.checkRoleAuth = checkRoleAuth;
//# sourceMappingURL=checkRoleAuth.js.map