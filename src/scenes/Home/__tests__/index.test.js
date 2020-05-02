import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';

import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from 'reducers';

import Home from 'scenes/Home';

const initialState = {
  gameSlug: null,
  showGame: false,
};

const getStore = (overrides = {}) =>
  compose(applyMiddleware(thunk))(createStore)(rootReducer, {
    ...initialState,
    ...overrides,
  });

const getComponent = store => (
  <Provider store={store}>
    <Home />
  </Provider>
);

describe('Home', () => {
  test('click solo play without crashing', () => {
    const wrapper = mount(getComponent(getStore()));
    expect(wrapper.render()).toMatchSnapshot();

    wrapper
      .findWhere(node => node.is('.button') && node.text() === 'Solo play')
      .simulate('click');
    jest.runOnlyPendingTimers();
    wrapper.update();

    // TODO: snapshot shows blurring because state is missing
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.unmount();
  });
});
