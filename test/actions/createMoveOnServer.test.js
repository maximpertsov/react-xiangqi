import createMoveOnServer from 'services/client';

describe('create move on server', () => {
  const position = { id: 1, move: 'a1a2' };
  const username = 'user';

  test('no request if no game slug', () => {
    createMoveOnServer({ gameSlug: null, position, username });
  });
  test('successful request', () => {
    createMoveOnServer({ gameSlug: 'ABC123', position, username });
  });
  test('failed request', () => {
    createMoveOnServer({ gameSlug: 'ABC123', position, username });
  });
});
