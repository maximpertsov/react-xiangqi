import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount, render } from 'enzyme';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from 'reducers';

import Board from 'components/Board';

import initialPlacementOnly from './fixtures/initialPlacementOnly.json';

const initialState = {
  gameSlug: null,
  showGame: true,
  moves: initialPlacementOnly,
  selectedFen: initialPlacementOnly[0].fen,
  animationOffset: [0, 0],
  selectedSquare: null,
};

const getStore = (overrides = {}) =>
  compose(applyMiddleware(thunk))(createStore)(rootReducer, {
    ...initialState,
    ...overrides,
  });

const getBoard = store => (
  <Provider store={store}>
    <DndProvider backend={Backend}>
      <Board />
    </DndProvider>
  </Provider>
);

// Helper functions

const getSquareNodes = (wrapper, squares) =>
  wrapper.find('Square').findWhere(node => squares.includes(node.key()));

const getSquareNode = (wrapper, square) => getSquareNodes(wrapper, [square]);

const clickSquare = (wrapper, square) => {
  getSquareNode(wrapper, square)
    .children()
    .simulate('click');

  jest.runOnlyPendingTimers();

  wrapper.update();
};

const expectSquaresToBeSelected = (wrapper, squares) => {
  const nodes = getSquareNodes(wrapper, squares).find('SelectionIndicator');
  expect(nodes).toHaveLength(squares.length);
};

const expectSquaresToBeTargeted = (wrapper, squares) => {
  const nodes = getSquareNodes(wrapper, squares).find('TargetIndicator');
  expect(nodes).toHaveLength(squares.length);
};

const expectSquaresToBeInLastMove = (wrapper, squares) => {
  const nodes = getSquareNodes(wrapper, squares).find('LastMoveIndicator');
  expect(nodes).toHaveLength(squares.length);
};

const expectToHavePiece = (wrapper, square, piece) => {
  const node = getSquareNode(wrapper, square).find(`.Piece .${piece}`);
  expect(node).toHaveLength(1);
};

const expectToBeEmptySquare = (wrapper, square) => {
  const node = getSquareNode(wrapper, square).find('.Piece');
  expect(node).toHaveLength(0);
};

describe('Board', () => {
  test('renders without crashing', () => {
    const wrapper = render(getBoard(getStore()));
    expect(wrapper).toMatchSnapshot();
  });

  // eslint-disable-next-line jest/expect-expect
  test('select and deselect a square', () => {
    const wrapper = mount(getBoard(getStore()));

    expectSquaresToBeSelected(wrapper, []);
    expectSquaresToBeTargeted(wrapper, []);

    clickSquare(wrapper, 'e4');
    expectSquaresToBeSelected(wrapper, ['e4']);
    expectSquaresToBeTargeted(wrapper, ['e5']);

    clickSquare(wrapper, 'e4');
    expectSquaresToBeSelected(wrapper, []);
    expectSquaresToBeTargeted(wrapper, []);

    wrapper.unmount();
  });

  test('move a piece to another square', () => {
    const store = getStore();
    const wrapper = mount(getBoard(store));

    expectToHavePiece(wrapper, 'e4', 'P');
    expectToBeEmptySquare(wrapper, 'e5');
    expectSquaresToBeInLastMove(wrapper, []);

    clickSquare(wrapper, 'e4');
    clickSquare(wrapper, 'e5');

    expectToBeEmptySquare(wrapper, 'e4');
    expectToHavePiece(wrapper, 'e5', 'P');
    expectSquaresToBeInLastMove(wrapper, ['e4', 'e5']);

    expect(store.getState().moves).toHaveLength(2);
  });
});
