import { mapMessagesToUserImages } from '../app/middlewares/socketUtils';

const assert = (cond: boolean, msg?: string) => {
  if (!cond) {
    console.error('TEST FAILED:', msg || 'assertion failed');
    process.exit(1);
  }
};

const run = () => {
  // initial messages: user 1 has null image, user 2 has an image
  const messages = [
    { id: 'm1', userId: 1, username: 'u1', role: 'user', from: 'u1', name: 'u1', image: null, body: 'hi', createAt: new Date().toISOString() },
    { id: 'm2', userId: 2, username: 'u2', role: 'user', from: 'u2', name: 'u2', image: 'http://example.com/p2.png', body: 'hey', createAt: new Date().toISOString() }
  ];

  // simulate later DB state where user 1 uploaded an image
  const userImages: Record<number, string | null> = {
    1: 'http://example.com/p1-updated.png',
    2: null,
  };

  const mapped = mapMessagesToUserImages(messages, userImages);

  // user 1's message should now include updated image URL
  assert(mapped[0].image === userImages[1], 'user 1 image should be updated');
  // user 2 has no image, so receives a fallback avatar URL
  assert(mapped[1].image?.startsWith('https://api.dicebear.com/api/identicon/'), 'user 2 should get a fallback avatar');

  console.log('All tests passed');
  process.exit(0);
};

run();
