import actions from 'actions';
import draw from 'actions/draw';
import axios from 'axios';

jest.mock('axios');

describe('draw', () => {
  const store = mockStore({});
  const io = { send: jest.fn() };
  const parameters = { io, gameSlug: 'ABC123', username: 'user1' };

  beforeEach(() => {
    axios.post.mockResolvedValue({});
  });

  afterEach(() => {
    store.clearActions();
    jest.resetAllMocks();
  });

  test('request', async () => {
    expect.assertions(3);
    await store.dispatch(draw.request(parameters));

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'offered_draw',
      payload: { username: 'user1' },
    });
    expect(io.send).toHaveBeenCalledWith('offered_draw', {
      gameSlug: 'ABC123',
      username: 'user1',
    });
    expect(store.getActions()).toStrictEqual([
      actions.game.openDrawOffer.set('user1'),
    ]);
  });

  test('cancel', async () => {
    expect.assertions(3);
    await store.dispatch(draw.cancel(parameters));

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'canceled_draw',
      payload: { username: 'user1' },
    });
    expect(io.send).toHaveBeenCalledWith('canceled_draw', {
      gameSlug: 'ABC123',
      username: 'user1',
    });
    expect(store.getActions()).toStrictEqual([
      actions.game.openDrawOffer.set(null),
    ]);
  });

  test('reject', async () => {
    expect.assertions(3);
    await store.dispatch(draw.reject(parameters));

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'rejected_draw',
      payload: { username: 'user1' },
    });
    expect(io.send).toHaveBeenCalledWith('rejected_draw', {
      gameSlug: 'ABC123',
      username: 'user1',
    });
    expect(store.getActions()).toStrictEqual([
      actions.game.openDrawOffer.set(null),
    ]);
  });

  test('accept', async () => {
    expect.assertions(3);
    await store.dispatch(draw.accept(parameters));

    expect(axios.post).toHaveBeenCalledWith('game/events', {
      game: 'ABC123',
      name: 'accepted_draw',
      payload: { username: 'user1' },
    });
    expect(io.send).toHaveBeenCalledWith('accepted_draw', {
      gameSlug: 'ABC123',
      username: 'user1',
    });
    expect(store.getActions()).toStrictEqual([
      actions.game.openDrawOffer.set(null),
    ]);
  });
});
