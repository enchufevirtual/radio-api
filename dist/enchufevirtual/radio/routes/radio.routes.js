"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const radio_controller_1 = require("../controller/radio.controller");
const checkOrigin_1 = require("../../../middlewares/checkOrigin");
const router = express_1.default.Router();
router.get('/', checkOrigin_1.checkOrigin, radio_controller_1.getCurrentSong);
exports.default = router;
//# sourceMappingURL=radio.routes.js.map