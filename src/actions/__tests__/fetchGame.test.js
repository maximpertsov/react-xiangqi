import axios from 'axios';
import actions from 'actions';
import fetchGame from 'actions/fetchGame';

jest.mock('axios');

describe('fetch game', () => {
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
        player2: {},
        score2: 1.0,
        openDrawOffer: 'user1',
        openTakebackOffer: 'user1',
        player1: {},
        score1: 0.0,
        moves,
      },
    });

    await store.dispatch(fetchGame({ gameSlug: 'ABC123' }));

    expect(axios.get).toHaveBeenCalledWith('game/ABC123');
    expect(store.getActions()).toStrictEqual([
      actions.game.player1.set({}),
      actions.game.score1.set(0.0),
      actions.game.player2.set({}),
      actions.game.score2.set(1.0),
      actions.game.selectedFen.set('FEN1'),
      actions.game.moves.set(moves),
      actions.game.openDrawOffer.set('user1'),
      actions.game.openTakebackOffer.set('user1'),
    ]);
  });
});
