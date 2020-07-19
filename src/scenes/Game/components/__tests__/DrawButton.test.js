import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'actions';
import draw from 'actions/draw';
import { getCurrentPlayer, getOpponent } from 'reducers/selectors';
import DrawButton from 'scenes/Game/components/DrawButton';

jest.mock('react-redux');
jest.mock('actions/draw');
jest.mock('reducers/selectors');

describe('DrawButton', () => {
  let store;
  let wrapper;

  beforeEach(() => {
    useDispatch.mockReturnValue(store.dispatch);
    useSelector.mockImplementation(callback => callback(store.getState()));
    getCurrentPlayer.mockReturnValue({ name: 'currentPlayer' });
    getOpponent.mockReturnValue({ name: 'opponent' });

    draw.request.mockReturnValue(() => {});
    draw.reject.mockReturnValue(() => {});
    draw.accept.mockReturnValue(() => {});
    draw.cancel.mockReturnValue(() => {});

    wrapper = shallowWrappedComponent(<DrawButton />, store);
  });

  afterEach(() => {
    store.clearActions();
  });

  describe('default button', () => {
    beforeAll(() => {
      store = mockStore({});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
      expect.assertions(2);
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

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
      wrapper.find('Button').simulate('click');

      expect(draw.request).toHaveBeenCalledWith({
        io: null,
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

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
      wrapper.find('Button').simulate('click');

      expect(draw.cancel).toHaveBeenCalledWith({
        io: null,
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

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click accept', () => {
      wrapper
        .find('Button')
        .find({ color: 'green' })
        .simulate('click');

      expect(draw.accept).toHaveBeenCalledWith({
        io: null,
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

      expect(draw.reject).toHaveBeenCalledWith({
        io: null,
        gameSlug: undefined,
        username: 'currentPlayer',
      });
      expect(store.getActions()).toStrictEqual([]);
    });
  });
});
