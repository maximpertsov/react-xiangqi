import axios from 'axios';
import createMoveOnServer from 'actions/createMoveOnServer';

import actions from 'actions';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');

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
      const spy = jest.spyOn(axios, 'post');
      await store.dispatch(
        createMoveOnServer({ gameSlug, position, username }),
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('a persisted game', () => {
    const gameSlug = 'ABC123';

    test('successful request', async () => {
      const spy = jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 });

      await store.dispatch(
        createMoveOnServer({ gameSlug, position, username }),
      );

      expect(spy).toHaveBeenCalledWith('game/ABC123/events', {
        name: 'move',
        move: position.move,
        player: username,
      });
    });

    test('failed request', async () => {
      const spy = jest.spyOn(axios, 'post').mockRejectedValue({ status: 400 });

      await store.dispatch(
        createMoveOnServer({ gameSlug, position, username }),
      );

      expect(spy).toHaveBeenCalledWith('game/ABC123/events', {
        name: 'move',
        move: position.move,
        player: username,
      });

      expect(store.getActions()).toEqual([
        actions.game.positions.remove({ id: 1 }),
      ]);
    });
  });
});
