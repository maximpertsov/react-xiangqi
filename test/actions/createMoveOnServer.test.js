import createMoveOnServer from 'actions/createMoveOnServer';
import * as client from 'services/client';

describe('create move on server', () => {
  const position = { id: 1, move: 'a1a2' };
  const username = 'user';

  describe('not a persisted game', () => {
    const gameSlug = null;

    test('action does not make an API request', async () => {
      const spy = jest.spyOn(client, 'postMove');

      await createMoveOnServer({ gameSlug, position, username })();
      expect(spy).toHaveBeenCalledTimes(0);

      spy.mockRestore();
    });
  });

  describe('a persisted game', () => {
    const gameSlug = 'ABC123';

    test('successful request', async () => {
      const spy = jest
        .spyOn(client, 'postMove')
        .mockImplementation(() => Promise.resolve({ status: 200 }));

      await createMoveOnServer({ gameSlug, position, username })();

      expect(spy).toHaveBeenCalledWith({
        gameSlug,
        move: position.move,
        username,
      });

      spy.mockRestore();
    });

    test('failed request', async () => {
      const spy = jest
        .spyOn(client, 'postMove')
        .mockImplementation(() => Promise.resolve({ status: 400 }));

      await createMoveOnServer({ gameSlug, position, username })();

      expect(spy).toHaveBeenCalledWith({
        gameSlug,
        move: position.move,
        username,
      });

      spy.mockRestore();
    });
  });
});
