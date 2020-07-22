import actions from 'actions';
import takeback from 'actions/takeback';
import axios from 'axios';

jest.mock('axios');

describe('takeback', () => {
  const store = mockStore({});
  const io = { send: jest.fn() };

  afterEach(() => {
    store.clearActions();
  });

  test('request', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      takeback.request({ io, gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'offered_takeback',
      payload: { username: 'user1' },
    });
    expect(io.send).toHaveBeenCalledWith('offered_takeback', {
      gameSlug: 'ABC123',
      username: 'user1',
    });
    expect(store.getActions()).toStrictEqual([
      actions.game.openTakebackOffer.set('user1'),
    ]);
  });

  test('cancel', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      takeback.cancel({ io, gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'canceled_takeback',
      payload: { username: 'user1' },
    });
    expect(io.send).toHaveBeenCalledWith('canceled_takeback', {
      gameSlug: 'ABC123',
      username: 'user1',
    });
    expect(store.getActions()).toStrictEqual([
      actions.game.openTakebackOffer.set(null),
    ]);
  });

  test('reject', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      takeback.reject({ io, gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'rejected_takeback',
      payload: { username: 'user1' },
    });
    expect(io.send).toHaveBeenCalledWith('rejected_takeback', {
      gameSlug: 'ABC123',
      username: 'user1',
    });
    expect(store.getActions()).toStrictEqual([
      actions.game.openTakebackOffer.set(null),
    ]);
  });

  test('accept', async () => {
    axios.post.mockResolvedValue({});

    await store.dispatch(
      takeback.accept({ io, gameSlug: 'ABC123', username: 'user1' }),
    );

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'accepted_takeback',
      payload: { username: 'user1' },
    });
    expect(io.send).toHaveBeenCalledWith('accepted_takeback', {
      gameSlug: 'ABC123',
      username: 'user1',
    });
    expect(store.getActions()).toStrictEqual([
      actions.game.openTakebackOffer.set(null),
    ]);
  });
});
