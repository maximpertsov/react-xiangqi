import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount, render } from 'enzyme';

import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from 'reducers';

import Board from 'components/Board';

import initialPlacementOnly from './fixtures/initialPlacementOnly.json';
import {
  clickSquare,
  expectToBeEmptySquare,
  expectToHavePiece,
  expectSquaresToBeInLastMove,
  expectSquaresToBeSelected,
  expectSquaresToBeTargeted,
} from './helpers';

const initialState = {
  gameSlug: null,
  showGame: true,
  positions: initialPlacementOnly,
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

const getStore = (overrides = {}) =>
  compose(applyMiddleware(thunk))(createStore)(rootReducer, {
    ...initialState,
    ...overrides,
  });

const getBoard = store => (
  <Provider store={store}>
    <Board />
  </Provider>
);

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

    expect(store.getState().positions).toHaveLength(2);
  });
});
