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

const clickSquare = (wrapper, square) => {
  const node = wrapper.find('Square').findWhere(node => node.key() == square);
  node.children().simulate('click');
  wrapper.update();
}

describe('Board', () => {
  test('renders without crashing', () => {
    expect(render(getBoard())).toMatchSnapshot();
  });

  test('select and deselect a square', () => {
    const wrapper = mount(getBoard());
    expect(wrapper.exists('SelectionIndicator')).toBe(false);

    clickSquare(wrapper, 'e4');
    expect(wrapper.exists('SelectionIndicator')).toBe(true);

    clickSquare(wrapper, 'e4');
    expect(wrapper.exists('SelectionIndicator')).toBe(false);

    wrapper.unmount();
  });
  //
  // test('move a piece to another square', () => {
  //   const wrapper = mount(getBoard());
  //   const e4 = wrapper.find('Square').findWhere(node => node.key() == 'e4');
  //   const e5 = wrapper.find('Square').findWhere(node => node.key() == 'e5');
  // });
});
