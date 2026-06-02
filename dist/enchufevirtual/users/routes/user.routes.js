"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const user_schema_1 = require("../../../Schemas/user.schema");
const validator_handler_1 = require("../../../middlewares/validator.handler");
const checkAuth_1 = require("../../../middlewares/checkAuth");
const checkRoleAuth_1 = require("../../../middlewares/checkRoleAuth");
const createImage_1 = require("../../../middlewares/createImage");
const router = express_1.default.Router();
// Public
router
    .route('/')
    .post((0, validator_handler_1.validatorHandler)(user_schema_1.createUserSchema, 'body'), createImage_1.createImage, user_controller_1.createUser);
router.get('/confirm/:token', user_controller_1.confirmUser);
router.post('/login', user_controller_1.authenticateUser);
// Private
router.get('/profile/', checkAuth_1.checkAuth, (0, checkRoleAuth_1.checkRoleAuth)(['user', 'admin']), user_controller_1.profile);
router.post('/identify', user_controller_1.forgetPasswordUser);
router
    .route('/identify/:token')
    .get(user_controller_1.checkTokenUser)
    .post(user_controller_1.newPasswordUser);
router.put('/update-password', checkAuth_1.checkAuth, user_controller_1.updateUserPassword);
router
    .route('/:id')
    .put(checkAuth_1.checkAuth, createImage_1.createImage, user_controller_1.updateUser)
    .delete(checkAuth_1.checkAuth, user_controller_1.deleteUser);
router.get('/:username', (0, validator_handler_1.validatorHandler)(user_schema_1.getUserSchema, 'params'), checkAuth_1.checkAuth, user_controller_1.getUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map