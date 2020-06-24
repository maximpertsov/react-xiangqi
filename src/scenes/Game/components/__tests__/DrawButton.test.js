import React from 'react';
import * as redux from 'react-redux';
import { shallow } from 'enzyme';
import values from 'lodash/values';
import * as selectors from 'reducers/selectors';

import actions from 'actions';
import draw from 'actions/draw';
import DrawButton from 'scenes/Game/components/DrawButton';

const getWrappedComponent = store =>
  shallow(
    <redux.Provider store={store}>
      <DrawButton />
    </redux.Provider>,
  )
    .dive()
    .dive();

describe('DrawButton', () => {
  let store = mockStore({});
  let spys = {};

  beforeEach(() => {
    spys.useDispatch = jest.spyOn(redux, 'useDispatch');
    spys.useDispatch.mockReturnValue(store.dispatch);

    spys.useSelector = jest.spyOn(redux, 'useSelector');
    spys.useSelector.mockImplementation(callback => callback(store.getState()));

    spys.getCurrentPlayer = jest.spyOn(selectors, 'getCurrentPlayer');
    spys.getCurrentPlayer.mockReturnValue({ name: 'currentPlayer' });

    spys.getOpponent = jest.spyOn(selectors, 'getOpponent');
    spys.getOpponent.mockReturnValue({ name: 'opponent' });
  });

  afterEach(() => {
    store.clearActions();
    values(spys).forEach(spy => spy.mockRestore());
  });

  test('default button', () => {
    const wrapper = getWrappedComponent(store);
    expect(wrapper).toMatchSnapshot();

    wrapper.find('Button').simulate('click');

    expect(store.getActions()).toStrictEqual([
      actions.game.confirmingDraw.set(true),
    ]);

    jest.runOnlyPendingTimers();

    expect(store.getActions()).toStrictEqual([
      actions.game.confirmingDraw.set(true),
      actions.game.confirmingDraw.set(false),
    ]);
  });

  test('confirmation button', () => {
    store = mockStore({ confirmingDraw: true });
    spys.requestDraw = jest.spyOn(draw, 'request');

    const wrapper = getWrappedComponent(store);
    expect(wrapper).toMatchSnapshot();

    wrapper.find('Button').simulate('click');

    expect(spys.requestDraw).toHaveBeenCalledWith({
      gameSlug: undefined,
      username: 'currentPlayer',
    });
    // TODO: why won't this action register?
    expect(store.getActions()).toStrictEqual([
      actions.game.confirmingDraw.set(false),
    ]);
  });

  test('cancel button', () => {
    store = mockStore({ openDrawOffer: 'currentPlayer' });

    const wrapper = getWrappedComponent(store);
    expect(wrapper).toMatchSnapshot();
  });

  test('accept or reject button', () => {
    store = mockStore({ openDrawOffer: 'opponent' });

    const wrapper = getWrappedComponent(store);
    expect(wrapper).toMatchSnapshot();
  });
});
