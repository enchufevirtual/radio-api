import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window as unknown as Window;
const DOMPurify = createDOMPurify(window as any);

export const sanitizeText = (value: string, maxLength = 1000): string => {
  const clean = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  const trimmed = String(clean).trim();
  return trimmed.slice(0, maxLength);
};
