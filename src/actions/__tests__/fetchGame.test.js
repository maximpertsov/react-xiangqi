import axios from 'axios';
import actions from 'actions';
import fetchGame from 'actions/fetchGame';

jest.mock('axios');

describe('fetch game', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});

  test('do nothing if the game slug is null', async () => {
    await store.dispatch(fetchGame({ gameSlug: null }));

    expect(axios.get).not.toHaveBeenCalled();
    expect(store.getActions()).toStrictEqual([]);
  });

  test('fetch game if slug is provided', async () => {
    const moves = [{}, { fen: 'FEN1' }];
    axios.get.mockResolvedValue({
      data: {
        blackPlayer: {},
        blackScore: 1.0,
        redPlayer: {},
        redScore: 0.0,
        moves,
      },
    });

    await store.dispatch(fetchGame({ gameSlug: 'ABC123' }));

    expect(axios.get).toHaveBeenCalledWith('game/ABC123');
    expect(store.getActions()).toStrictEqual([
      actions.game.redPlayer.set({}),
      actions.game.redScore.set(0.0),
      actions.game.blackPlayer.set({}),
      actions.game.blackScore.set(1.0),
      actions.game.selectedFen.set('FEN1'),
      actions.game.moves.set(moves),
    ]);
  });
});
