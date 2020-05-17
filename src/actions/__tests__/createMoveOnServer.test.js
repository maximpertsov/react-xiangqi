import axios from 'axios';
import createMoveOnServer from 'actions/createMoveOnServer';
import actions from 'actions';

jest.mock('axios');

describe('create move on server', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // eslint-disable-next-line no-undef
  const store = mockStore({});
  const move = { id: 1, fan: 'a1a2' };
  const username = 'user';

  describe('not a persisted game', () => {
    const gameSlug = null;

    test('action does not make an API request', async () => {
      const spy = jest.spyOn(axios, 'post');
      await store.dispatch(
        createMoveOnServer({
          gameSlug,
          id: move.id,
          fan: move.fan,
          username,
        }),
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('a persisted game', () => {
    const gameSlug = 'ABC123';

    test('successful request', async () => {
      const spy = jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 });

      await store.dispatch(
        createMoveOnServer({
          gameSlug,
          id: move.id,
          fan: move.fan,
          username,
        }),
      );

      expect(spy).toHaveBeenCalledWith('game/ABC123/events', {
        name: 'move',
        fan: move.fan,
        player: username,
      });
    });

    test('failed request', async () => {
      const spy = jest.spyOn(axios, 'post').mockRejectedValue({ status: 400 });

      await store.dispatch(
        createMoveOnServer({
          gameSlug,
          id: move.id,
          fan: move.fan,
          username,
        }),
      );

      expect(spy).toHaveBeenCalledWith('game/ABC123/events', {
        name: 'move',
        fan: move.fan,
        player: username,
      });

      expect(store.getActions()).toStrictEqual([
        actions.game.moves.remove(1),
      ]);
    });
  });
});
