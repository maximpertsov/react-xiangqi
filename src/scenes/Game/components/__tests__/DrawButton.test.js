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

  describe('default button', () => {
    beforeAll(() => {
      store = mockStore({});
    });

    test('click', () => {
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
  });

  describe('confirmation button', () => {
    beforeAll(() => {
      store = mockStore({ confirmingDraw: true });
      spys.requestDraw = jest.spyOn(draw, 'request');
      spys.requestDraw.mockReturnValue(() => {});
    });

    test('click', () => {
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
  });

  describe('cancel button', () => {
    beforeAll(() => {
      store = mockStore({ openDrawOffer: 'currentPlayer' });
      spys.cancelDraw = jest.spyOn(draw, 'cancel');
      spys.cancelDraw.mockReturnValue(() => {});
    });

    test('click', () => {
      const wrapper = getWrappedComponent(store);
      expect(wrapper).toMatchSnapshot();

      wrapper.find('Button').simulate('click');

      expect(spys.cancelDraw).toHaveBeenCalledWith({
        gameSlug: undefined,
        username: 'currentPlayer',
      });
      expect(store.getActions()).toStrictEqual([]);
    });
  });

  describe('accept or reject button', () => {
    beforeAll(() => {
      store = mockStore({ openDrawOffer: 'opponent' });
    });

    test('click', () => {
      const wrapper = getWrappedComponent(store);
      expect(wrapper).toMatchSnapshot();

      wrapper.find('Button').find({ color: 'green' }).simulate('click');

      // expect(spys.cancelDraw).toHaveBeenCalledWith({
      //   gameSlug: undefined,
      //   username: 'currentPlayer',
      // });
      // expect(store.getActions()).toStrictEqual([]);
    });
  });
});
