import actions from 'actions';
import createMoveOnServer from 'actions/createMoveOnServer';
import axios from 'axios';

jest.mock('axios');

describe('create move on server', () => {
  const store = mockStore({});
  const move = { uci: 'a1a2', fen: 'FEN' };
  const username = 'user';
  const io = { send: jest.fn() };

  const subject = async gameSlug => {
    await store.dispatch(
      createMoveOnServer({ gameSlug, io, username, ...move }),
    );
  };

  afterEach(() => {
    store.clearActions();
    jest.resetAllMocks();
  });

  describe('not a persisted game', () => {
    const gameSlug = null;

    test('action does not make an API request', async () => {
      expect.assertions(1);

      await subject(gameSlug);

      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe('a persisted game', () => {
    const gameSlug = 'ABC123';

    test('successful request', async () => {
      expect.assertions(3);
      axios.post.mockResolvedValue({ status: 200 });

      await subject(gameSlug);

      expect(axios.post).toHaveBeenCalledWith('game/events', {
        name: 'move',
        game: gameSlug,
        payload: {
          uci: move.uci,
          fen: move.fen,
          player: username,
        },
      });
      expect(io.send).toHaveBeenCalledTimes(1);
      expect(store.getActions()).toStrictEqual([]);
    });

    test('failed request', async () => {
      expect.assertions(3);
      axios.post.mockRejectedValue({});

      await subject(gameSlug);

      expect(axios.post).toHaveBeenCalledWith('game/events', {
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
