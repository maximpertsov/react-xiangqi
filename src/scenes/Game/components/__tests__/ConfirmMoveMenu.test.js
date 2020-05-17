import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount, render } from 'enzyme';

import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from 'reducers';
import * as createMoveOnServer from 'actions/createMoveOnServer';

import ConfirmMoveMenu from 'scenes/Game/components/ConfirmMoveMenu';

const initialState = {
  animationOffset: [0, 0],
  gameSlug: 'ABC123',
  showConfirmMoveMenu: true,
  positions: [
    { id: 0, fan: null },
    { id: 1, fan: 'a1a2' },
  ],
  players: [
    {
      color: 'red',
    },
    {
      color: 'black',
    },
  ],
  selectedMoveId: null,
  selectedSquare: null,
  showGame: true,
  username: 'user',
};

const getStore = (overrides = {}) =>
  compose(applyMiddleware(thunk))(createStore)(rootReducer, {
    ...initialState,
    ...overrides,
  });

const getComponent = store => (
  <Provider store={store}>
    <ConfirmMoveMenu />
  </Provider>
);

describe('ConfirmMoveMenu', () => {
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
      id: 1,
      fan: 'a1a2',
      username: 'user',
    });

    // Confirm state
    expect(store.getState().showConfirmMoveMenu).toBe(false);
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
    expect(store.getState().showConfirmMoveMenu).toBe(false);
    expect(store.getState().positions).toEqual([{ id: 0, fan: null }]);
    expect(wrapper.render()).toMatchSnapshot();

    wrapper.unmount();
  });
});
