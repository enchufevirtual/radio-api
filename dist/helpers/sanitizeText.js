"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeText = void 0;
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
const window = new jsdom_1.JSDOM('').window;
const DOMPurify = (0, dompurify_1.default)(window);
const sanitizeText = (value, maxLength = 1000) => {
    const clean = DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
    const trimmed = String(clean).trim();
    return trimmed.slice(0, maxLength);
};
exports.sanitizeText = sanitizeText;
//# sourceMappingURL=sanitizeText.js.map