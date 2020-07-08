import axios from 'axios';
import createMoveOnServer from 'actions/createMoveOnServer';
import actions from 'actions';

jest.mock('axios');

describe('create move on server', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const store = mockStore({});
  const move = { uci: 'a1a2', fen: 'FEN' };
  const username = 'user';

  describe('not a persisted game', () => {
    const gameSlug = null;

    test('action does not make an API request', async () => {
      const spy = jest.spyOn(axios, 'post');
      await store.dispatch(
        createMoveOnServer(null, {
          gameSlug,
          uci: move.uci,
          fen: move.fen,
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
      const io = { send: jest.fn() };

      await store.dispatch(
        createMoveOnServer(io, {
          gameSlug,
          uci: move.uci,
          fen: move.fen,
          username,
        }),
      );

      expect(spy).toHaveBeenCalledWith('game/events', {
        name: 'move',
        game: gameSlug,
        payload: {
          uci: move.uci,
          fen: move.fen,
          player: username,
        },
      });
      expect(io.send).toHaveBeenCalledTimes(1);
    });

    test('failed request', async () => {
      const spy = jest.spyOn(axios, 'post').mockRejectedValue(new Error());
      const io = { send: jest.fn() };

      await store.dispatch(
        createMoveOnServer(io, {
          gameSlug,
          uci: move.uci,
          fen: move.fen,
          username,
        }),
      );

      expect(spy).toHaveBeenCalledWith('game/events', {
        name: 'move',
        game: gameSlug,
        payload: {
          uci: move.uci,
          fen: move.fen,
          player: username,
        },
      });
      expect(io.send).toHaveBeenCalledTimes(0);
      expect(store.getActions()).toStrictEqual([
        actions.game.moves.remove(move.fen),
      ]);
    });
  });
});
