import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount, render } from 'enzyme';

import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from 'reducers';
import * as createMoveOnServer from 'actions/createMoveOnServer';

import ConfirmPositionMenu from 'scenes/Game/components/ConfirmPositionMenu';

const initialState = {
  gameSlug: 'ABC123',
  showGame: true,
  positions: [
    { id: 0, move: null },
    { id: 1, move: 'a1a2' },
  ],
  pendingPositionId: 0,
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
  username: 'user',
};

const getStore = (overrides = {}) =>
  compose(applyMiddleware(thunk))(createStore)(rootReducer, {
    ...initialState,
    ...overrides,
  });

const getComponent = store => (
  <Provider store={store}>
    <ConfirmPositionMenu />
  </Provider>
);

describe('ConfirmPositionMenu', () => {
  test('renders without crashing', () => {
    const wrapper = render(getComponent(getStore()));
    expect(wrapper).toMatchSnapshot();
  });

  test('confirm closes the method', () => {
    const spy = jest.spyOn(createMoveOnServer, 'default');

    const store = getStore();
    const wrapper = mount(getComponent(store));

    // Click confirm
    wrapper.find('.button.green').simulate('click');
    jest.runOnlyPendingTimers();
    wrapper.update();

    // TODO: Test actions with mockStore

    // Calls API
    expect(spy).toHaveBeenCalledWith({
      gameSlug: 'ABC123',
      position: { id: 1, move: 'a1a2' },
      username: 'user',
    });

    // Confirm state
    expect(store.getState().pendingPositionId).toBe(null);
    expect(wrapper.render()).toMatchSnapshot();

    spy.mockRestore();

    wrapper.unmount();
  });

  test('cancel removes the last move and closes the method', () => {
    const store = getStore();
    const wrapper = mount(getComponent(store));

    // Click confirm
    wrapper.find('.button.red').simulate('click');
    jest.runOnlyPendingTimers();
    wrapper.update();

    // TODO: Test actions with mockStore

    // Confirm state
    expect(store.getState().pendingPositionId).toBe(null);
    expect(store.getState().positions).toEqual([{ id: 0, move: null }]);
    expect(wrapper.render()).toMatchSnapshot();

    wrapper.unmount();
  });
});
