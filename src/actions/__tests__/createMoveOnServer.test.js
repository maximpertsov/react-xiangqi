import createMoveOnServer from 'actions/createMoveOnServer';
import * as client from 'services/client';

import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('create move on server', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const store = mockStore({});
  const position = { id: 1, move: 'a1a2' };
  const username = 'user';

  describe('not a persisted game', () => {
    const gameSlug = null;

    test('action does not make an API request', async () => {
      const spy = jest.spyOn(client, 'postMove');
      await store.dispatch(
        createMoveOnServer({ gameSlug, position, username }),
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('a persisted game', () => {
    const gameSlug = 'ABC123';

    test('successful request', async () => {
      const spy = jest
        .spyOn(client, 'postMove')
        .mockImplementation(() => Promise.resolve({ status: 200 }));

      await store.dispatch(
        createMoveOnServer({ gameSlug, position, username }),
      );

      expect(spy).toHaveBeenCalledWith({
        gameSlug,
        move: position.move,
        username,
      });
    });

    test('failed request', async () => {
      const spy = jest
        .spyOn(client, 'postMove')
        .mockImplementation(() => Promise.reject({ status: 400 }));

      await store.dispatch(
        createMoveOnServer({ gameSlug, position, username }),
      );

      expect(spy).toHaveBeenCalledWith({
        gameSlug,
        move: position.move,
        username,
      });

      expect(store.getActions()).toEqual([{ type: 'remove_position', id: 1 }]);
    });
  });
});
