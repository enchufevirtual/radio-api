"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = exports.emailConfig = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailHost = (_b = (_a = process.env.EMAIL_HOST) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
const emailPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 0;
const emailUser = (_d = (_c = process.env.EMAIL_USER) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : '';
const emailPass = (_f = (_e = process.env.EMAIL_PASS) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : '';
const emailFrom = ((_g = process.env.EMAIL_FROM) === null || _g === void 0 ? void 0 : _g.trim()) || 'Radio Enchufe Virtual <no-reply@enchufevirtual.com>';
const frontendUrl = (_j = (_h = process.env.FRONTEND_URL) === null || _h === void 0 ? void 0 : _h.trim()) !== null && _j !== void 0 ? _j : '';
if (!emailHost || !emailPort || !emailUser || !emailPass || !frontendUrl) {
    throw new Error('Missing required email configuration. Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS and FRONTEND_URL.');
}
if (!/^https?:\/\//i.test(frontendUrl)) {
    throw new Error('FRONTEND_URL must include http:// or https://');
}
exports.emailConfig = {
    host: emailHost,
    port: emailPort,
    user: emailUser,
    pass: emailPass,
    from: emailFrom,
    frontendUrl: frontendUrl.replace(/\/+$/, ''),
    secure: process.env.EMAIL_SECURE === 'true' || emailPort === 465,
    rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== 'false'
};
exports.transporter = nodemailer_1.default.createTransport({
    host: exports.emailConfig.host,
    port: exports.emailConfig.port,
    secure: exports.emailConfig.secure,
    auth: {
        user: exports.emailConfig.user,
        pass: exports.emailConfig.pass
    },
    tls: {
        rejectUnauthorized: exports.emailConfig.rejectUnauthorized
    }
});
//# sourceMappingURL=emailTransport.js.map