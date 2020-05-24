import actions from 'actions';
import animateMove from 'actions/animateMove';

describe('animate a move', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});
  const uci = 'a1b2';

  afterEach(() => {
    store.clearActions();
  });

  test('bottom player is red', async () => {
    await store.dispatch(animateMove({ bottomPlayerIsRed: true, uci }));

    expect(store.getActions()).toStrictEqual([
      actions.board.animationOffset.set([1, -1]),
    ]);
  });

  test('bottom player is black', async () => {
    await store.dispatch(animateMove({ bottomPlayerIsRed: false, uci }));

    expect(store.getActions()).toStrictEqual([
      actions.board.animationOffset.set([-1, 1]),
    ]);
  });
});
