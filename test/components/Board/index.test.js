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
    const e4 = getSquareNode(wrapper, 'e4');
    const e5 = getSquareNode(wrapper, 'e5');
  });
});