import actions from 'actions';
import clickSquare from 'actions/clickSquare';

describe('click square', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});
  const defaultArguments = {
    bottomPlayerIsRed: true,
    legalMoves: [],
    square: null,
    selectedMove: {},
    selectedSquare: null,
  };
  const callSubject = parameters =>
    store.dispatch(clickSquare({ ...defaultArguments, ...parameters }));

  afterEach(() => {
    store.clearActions();
  });

  test.todo('click on a piece square when no square is selected');
  test.todo('click on an empty square when no square is selected');
  test.todo('click on an friendly piece square when a square is selected');
  test.todo('click on an enemy piece square when a square is selected');

  test('click square that is already selected', () => {
    callSubject({ square: 'a1', selectedSquare: 'a1' });

    expect(store.getActions()).toStrictEqual([
      actions.board.selectedSquare.set(null),
    ]);
  });
});
