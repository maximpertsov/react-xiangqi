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
  let store = {};
  let spys = {};

  const setup = () => {
    spys.useDispatch = jest.spyOn(redux, 'useDispatch');
    spys.useDispatch.mockReturnValue(store.dispatch);

    spys.useSelector = jest.spyOn(redux, 'useSelector');
    spys.useSelector.mockImplementation(callback => callback(store.getState()));

    spys.getCurrentPlayer = jest.spyOn(selectors, 'getCurrentPlayer');
    spys.getCurrentPlayer.mockReturnValue({ name: 'currentPlayer' });

    spys.getOpponent = jest.spyOn(selectors, 'getOpponent');
    spys.getOpponent.mockReturnValue({ name: 'opponent' });
  };

  afterEach(() => {
    store.clearActions();
    values(spys).forEach(spy => spy.mockRestore());
  });

  test('default button', () => {
    store = mockStore({});
    setup();

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
    setup();

    spys.requestDraw = jest.spyOn(draw, 'request');
    spys.requestDraw.mockReturnValue(() => {});

    const wrapper = getWrappedComponent(store);
    expect(wrapper).toMatchSnapshot();

    wrapper.find('Button').simulate('click');

    expect(spys.requestDraw).toHaveBeenCalledWith({
      gameSlug: undefined,
      username: 'currentPlayer',
    });
    expect(store.getActions()).toStrictEqual([
      actions.game.confirmingDraw.set(false),
    ]);
  });

  test('cancel button', () => {
    store = mockStore({ openDrawOffer: 'currentPlayer' });
    setup();

    const wrapper = getWrappedComponent(store);
    expect(wrapper).toMatchSnapshot();
  });

  test('accept or reject button', () => {
    store = mockStore({ openDrawOffer: 'opponent' });
    setup();

    const wrapper = getWrappedComponent(store);
    expect(wrapper).toMatchSnapshot();
  });
});
