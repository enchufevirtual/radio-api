"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOrigin = void 0;
const getAllowedOrigins = () => {
    const envValue = process.env.FRONTEND_URL || process.env.FRONTEND_URLS || '';
    return envValue
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean);
};
const allowedOrigins = getAllowedOrigins();
const originMatches = (value) => {
    if (!value)
        return false;
    return allowedOrigins.some(origin => value.startsWith(origin));
};
const checkOrigin = (req, res, next) => {
    const originHeader = req.headers.origin;
    const refererHeader = req.headers.referer;
    if (originMatches(originHeader) || originMatches(refererHeader)) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};
exports.checkOrigin = checkOrigin;
//# sourceMappingURL=checkOrigin.js.map