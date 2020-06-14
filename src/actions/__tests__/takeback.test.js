
import axios from 'axios';
import actions from 'actions';
import takeback from 'actions/takeback';

jest.mock('axios');

describe('takeback', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});

  afterEach(() => {
    store.clearActions();
  });

  test('request', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      takeback.request({ gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'offered_takeback',
      payload: { username: 'user1' },
    });

    expect(store.getActions()).toStrictEqual([
      actions.game.openTakebackOffer.set('user1'),
    ]);
  });

  test('cancel', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      takeback.cancel({ gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'canceled_takeback',
      payload: { username: 'user1' },
    });

    expect(store.getActions()).toStrictEqual([
      actions.game.openTakebackOffer.set(null),
    ]);
  });

  test('reject', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      takeback.reject({ gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'rejected_takeback',
      payload: { username: 'user1' },
    });

    expect(store.getActions()).toStrictEqual([
      actions.game.openTakebackOffer.set(null),
    ]);
  });

  test('accept', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      takeback.accept({ gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'accepted_takeback',
      payload: { username: 'user1' },
    });

    expect(store.getActions()).toStrictEqual([
      actions.game.openTakebackOffer.set(null),
    ]);
  });
});
