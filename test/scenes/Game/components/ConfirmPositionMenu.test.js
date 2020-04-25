import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount, render } from 'enzyme';

import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from 'reducers';

import ConfirmPositionMenu from 'scenes/Game/components/ConfirmPositionMenu';

const initialState = {
  gameSlug: 'ABC123',
  showGame: true,
  positions: [{ id: 0 }, { id: 1 }],
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
    const store = getStore();
    const wrapper = mount(getComponent(store));

    // Click confirm
    wrapper.find('.button.green').simulate('click');
    jest.runOnlyPendingTimers();
    wrapper.update();

    // Test actions with mockStore
    expect(store.getState().pendingPositionId).toBe(null);
    expect(wrapper.render()).toMatchSnapshot()

    wrapper.unmount();
  });
});
