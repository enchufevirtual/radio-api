"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerKeyFromAuth = exports.mapMessagesToUserImages = exports.getAvatarUrl = void 0;
const makeAvatarFallback = (userId, username) => {
    const seed = encodeURIComponent(`${username || `user${userId}`}-${userId}`);
    return `https://api.dicebear.com/api/identicon/${seed}.svg?size=40`;
};
const makeImageUrl = (image) => {
    if (!image)
        return null;
    if (image.startsWith('http://') || image.startsWith('https://'))
        return image;
    return `/${encodeURIComponent(image)}`;
};
const getAvatarUrl = (image, userId, username) => {
    const imageUrl = image ? makeImageUrl(image) : null;
    return imageUrl || makeAvatarFallback(userId, username);
};
exports.getAvatarUrl = getAvatarUrl;
const mapMessagesToUserImages = (messages, userImages) => {
    return messages.map((m) => {
        const currentImage = Object.prototype.hasOwnProperty.call(userImages, m.userId)
            ? userImages[m.userId]
            : m.image;
        return Object.assign(Object.assign({}, m), { image: (0, exports.getAvatarUrl)(currentImage !== null && currentImage !== void 0 ? currentImage : null, m.userId, m.username) });
    });
};
exports.mapMessagesToUserImages = mapMessagesToUserImages;
// Derive ownerKey from handshake auth payload
const getOwnerKeyFromAuth = (auth, socketId) => {
    if (auth && auth.userId)
        return `user:${auth.userId}`;
    if (auth && auth.clientId)
        return `guest:${auth.clientId}`;
    return `guest:${socketId}`;
};
exports.getOwnerKeyFromAuth = getOwnerKeyFromAuth;
exports.default = {
    mapMessagesToUserImages: exports.mapMessagesToUserImages,
    getOwnerKeyFromAuth: exports.getOwnerKeyFromAuth,
    getAvatarUrl: exports.getAvatarUrl,
};
//# sourceMappingURL=socketUtils.js.map