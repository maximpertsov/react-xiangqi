import React from 'react';
import * as selectors from 'reducers/selectors';

import actions from 'actions';
import draw from 'actions/draw';
import DrawButton from 'scenes/Game/components/DrawButton';

describe('DrawButton', () => {
  let store;
  let wrapper;
  let spys = {};

  beforeEach(() => {
    setupReduxSpys(spys, store);

    spys.getCurrentPlayer = jest.spyOn(selectors, 'getCurrentPlayer');
    spys.getCurrentPlayer.mockReturnValue({ name: 'currentPlayer' });

    spys.getOpponent = jest.spyOn(selectors, 'getOpponent');
    spys.getOpponent.mockReturnValue({ name: 'opponent' });

    wrapper = shallowWrappedComponent(<DrawButton />, store);
  });

  afterEach(() => {
    store.clearActions();
    restoreSpys(spys);
  });

  describe('default button', () => {
    beforeAll(() => {
      store = mockStore({});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
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
    });

    beforeEach(() => {
      spys.requestDraw = jest.spyOn(draw, 'request');
      spys.requestDraw.mockReturnValue(() => {});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
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
    });

    beforeEach(() => {
      spys.cancelDraw = jest.spyOn(draw, 'cancel');
      spys.cancelDraw.mockReturnValue(() => {});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
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

    beforeEach(() => {
      spys.acceptDraw = jest.spyOn(draw, 'accept');
      spys.acceptDraw.mockReturnValue(() => {});
      spys.rejectDraw = jest.spyOn(draw, 'reject');
      spys.rejectDraw.mockReturnValue(() => {});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click accept', () => {
      wrapper
        .find('Button')
        .find({ color: 'green' })
        .simulate('click');

      expect(spys.acceptDraw).toHaveBeenCalledWith({
        gameSlug: undefined,
        username: 'currentPlayer',
      });
      expect(store.getActions()).toStrictEqual([]);
    });

    test('click reject', () => {
      wrapper
        .find('Button')
        .find({ color: 'red' })
        .simulate('click');

      expect(spys.rejectDraw).toHaveBeenCalledWith({
        gameSlug: undefined,
        username: 'currentPlayer',
      });
      expect(store.getActions()).toStrictEqual([]);
    });
  });
});
