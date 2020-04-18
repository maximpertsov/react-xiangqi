import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount, render } from 'enzyme';

import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from 'reducers';

import Board from 'components/Board';

import initialPlacementOnly from './fixtures/initialPlacementOnly.json';

const initialState = {
  gameSlug: null,
  showGame: true,
  moves: initialPlacementOnly,
  players: [
    {
      color: 'red',
    },
    {
      color: 'black',
    },
  ],
  selectedMoveId: null,
  animationOffset: [0, 0],
  selectedSquare: null,
};

const getBoard = (overrides = {}) => {
  const store = compose(applyMiddleware(thunk))(createStore)(rootReducer, {
    ...initialState,
    ...overrides,
  });
  return (
    <Provider store={store}>
      <Board />
    </Provider>
  );
};

const getSquareNode = (wrapper, square) =>
  wrapper.find('Square').findWhere(node => node.key() == square);

const clickSquare = (wrapper, square) => {
  const node = getSquareNode(wrapper, square);
  node.children().simulate('click');
  wrapper.update();
};

const getSelections = wrapper => wrapper.find('SelectionIndicator');

const getEmptyTargets = wrapper => wrapper.find('TargetEmptyIndicator');

const expectToHavePiece = (wrapper, square, piece) => {
  const node = getSquareNode(wrapper, square);
  expect(node.find(`.Piece .${piece}`)).toHaveLength(1);
}

describe('Board', () => {
  test('renders without crashing', () => {
    expect(render(getBoard())).toMatchSnapshot();
  });

  test('select and deselect a square', () => {
    const wrapper = mount(getBoard());
    expect(getSelections(wrapper)).toHaveLength(0);
    expect(getEmptyTargets(wrapper)).toHaveLength(0);

    clickSquare(wrapper, 'e4');
    expect(getSelections(wrapper)).toHaveLength(1);
    expect(getEmptyTargets(wrapper)).toHaveLength(1);

    clickSquare(wrapper, 'e4');
    expect(getSelections(wrapper)).toHaveLength(0);
    expect(getEmptyTargets(wrapper)).toHaveLength(0);

    wrapper.unmount();
  });

  test('move a piece to another square', () => {
    const wrapper = mount(getBoard());
    expectToHavePiece(wrapper, 'e4', 'P')

    clickSquare(wrapper, 'e4');
    clickSquare(wrapper, 'e5');
    expectToHavePiece(wrapper, 'e5', 'P')
  });
});
