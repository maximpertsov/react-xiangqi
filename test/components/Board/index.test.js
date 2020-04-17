import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';

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

describe('Board component integration tests', () => {
  test('select and deselect a square', () => {
    const wrapper = mount(getBoard());
    expect(wrapper.exists('SelectionIndicator')).toBe(false);

    const e4 = wrapper.find('Square').findWhere(node => node.key() == 'e4');
    e4.children().simulate('click');
    wrapper.update();
    expect(wrapper.exists('SelectionIndicator')).toBe(true);

    e4.children().simulate('click');
    wrapper.update();
    expect(wrapper.exists('SelectionIndicator')).toBe(false);

    wrapper.unmount();
  });
});
