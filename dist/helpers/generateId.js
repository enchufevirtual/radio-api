"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
const generateId = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
};
exports.generateId = generateId;
//# sourceMappingURL=generateId.js.map