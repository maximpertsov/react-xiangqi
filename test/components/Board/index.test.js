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
  expectSquaresToBeSelected,
  expectSquaresToBeTargeted,
} from './helpers';

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

  test('select and deselect a square', () => {
    const wrapper = mount(getBoard(getStore()));
    expectSquaresToBeSelected(wrapper, 0);
    expectSquaresToBeTargeted(wrapper, 0);

    clickSquare(wrapper, 'e4');
    expectSquaresToBeSelected(wrapper, 1);
    expectSquaresToBeTargeted(wrapper, 1);

    clickSquare(wrapper, 'e4');
    expectSquaresToBeSelected(wrapper, 0);
    expectSquaresToBeTargeted(wrapper, 0);

    wrapper.unmount();
  });

  test('move a piece to another square', () => {
    const store = getStore();
    const wrapper = mount(getBoard(store));

    expectToHavePiece(wrapper, 'e4', 'P');
    expectToBeEmptySquare(wrapper, 'e5');

    clickSquare(wrapper, 'e4');
    clickSquare(wrapper, 'e5');

    expectToHavePiece(wrapper, 'e5', 'P');
    expectToBeEmptySquare(wrapper, 'e4');
    expect(store.getState().moves).toHaveLength(2);
  });
});
