import axios from 'axios';
import actions from 'actions';
import draw from 'actions/draw';

jest.mock('axios');

describe('draw', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});

  afterEach(() => {
    store.clearActions();
  });

  test('request', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      draw.request({ gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'offered_draw',
      payload: { username: 'user1' },
    });

    expect(store.getActions()).toStrictEqual([
      actions.game.openDrawOffer.set('user1'),
    ]);
  });

  test('cancel', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      draw.cancel({ gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'canceled_draw',
      payload: { username: 'user1' },
    });

    expect(store.getActions()).toStrictEqual([
      actions.game.openDrawOffer.set(null),
    ]);
  });

  test('reject', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      draw.reject({ gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'rejected_draw',
      payload: { username: 'user1' },
    });

    expect(store.getActions()).toStrictEqual([
      actions.game.openDrawOffer.set(null),
    ]);
  });

  test('accept', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      draw.accept({ gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'accepted_draw',
      payload: { username: 'user1' },
    });

    expect(store.getActions()).toStrictEqual([
      actions.game.openDrawOffer.set(null),
    ]);
  });
});
