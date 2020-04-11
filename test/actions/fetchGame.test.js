import axios from 'axios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetchGame from 'actions/fetchGame';
import XiangqiBoard from 'services/logic';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetch game', () => {
  const store = mockStore({});

  test('do nothing if the game slug is null', async () => {
    await store.dispatch(fetchGame({ gameSlug: null }));

    expect(store.getActions()).toEqual([]);
  });

  test('fetch game if slug is provided', async () => {
    jest.mock('axios');
    axios.get = jest.fn(() =>
      Promise.resolve({
        data: {
          players: [],
          moves: [{ id: 1 }, { id: 2 }],
        },
      }),
    );

    const gameSlug = 'ABC123';
    await store.dispatch(fetchGame({ gameSlug }));
    expect(axios.get).toHaveBeenCalledWith(`game/${gameSlug}`);

    // TODO: stub these
    const moveData = {
      board: new XiangqiBoard({ fen: undefined }),
      pending: false,
      piece: null,
    };
    expect(store.getActions()).toEqual([
      { type: 'set_players', players: [] },
      {
        type: 'set_moves',
        moves: [
          { id: 1, ...moveData },
          { id: 2, ...moveData },
        ],
      },
      { type: 'select_move', moveId: 2 },
    ]);
  });
});
