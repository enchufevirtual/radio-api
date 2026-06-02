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
exports.SocialService = void 0;
const sequelize_1 = require("../../libs/sequelize");
class SocialService {
    constructor() {
        this.social = sequelize_1.sequelize.models.Social;
    }
    update(userId, socialData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [socialObj, created] = yield this.social.findOrCreate({
                where: { userId },
                defaults: { userId }
            });
            if (!created) {
                yield socialObj.update(socialData);
            }
            else if (socialData) {
                yield socialObj.update(socialData);
            }
            return socialObj;
        });
    }
}
exports.SocialService = SocialService;
//# sourceMappingURL=social.service.js.map