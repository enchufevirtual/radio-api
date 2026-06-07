export interface MsgRecord {
  id: string;
  userId: number;
  username: string;
  role: string;
  from: string;
  name: string;
  image: string | null;
  body: string;
  createAt: string;
}

const makeAvatarFallback = (userId: number, username: string) => {
  const seed = encodeURIComponent(`${username || `user${userId}`}-${userId}`);
  return `https://api.dicebear.com/api/identicon/${seed}.svg?size=40`;
};

const makeImageUrl = (image: string) => {
  const cleaned = image.trim();
  if (cleaned.length === 0 || ['null', 'undefined'].includes(cleaned.toLowerCase())) {
    return null;
  }

  if (/^https?:\/\//.test(cleaned)) return cleaned;

  const segments = cleaned.split('/').map((segment) => encodeURIComponent(segment));
  const normalized = segments.join('/');
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
};

export const getAvatarUrl = (image: string | null, userId: number, username: string) => {
  const imageUrl = image ? makeImageUrl(image) : null;
  return imageUrl || makeAvatarFallback(userId, username);
};

export const mapMessagesToUserImages = (messages: MsgRecord[], userImages: Record<number, string | null>) => {
  return messages.map((m) => {
    const currentImage = Object.prototype.hasOwnProperty.call(userImages, m.userId)
      ? userImages[m.userId]
      : m.image;
    const resolvedImage = getAvatarUrl(currentImage ?? null, m.userId, m.username);
    const userData = (m as any).user;
    return {
      ...m,
      image: resolvedImage,
      ...(userData ? { user: { ...userData, image: resolvedImage } } : {}),
    };
  });
};

// Derive ownerKey from handshake auth payload
export const getOwnerKeyFromAuth = (auth: any, socketId: string) => {
  if (auth && auth.userId) return `user:${auth.userId}`;
  if (auth && auth.clientId) return `guest:${auth.clientId}`;
  return `guest:${socketId}`;
};

export default {
  mapMessagesToUserImages,
  getOwnerKeyFromAuth,
  getAvatarUrl,
};
