import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'actions';
import resign from 'actions/resign';
import { getCurrentPlayer, getOpponent } from 'reducers/selectors';
import ResignButton from 'scenes/Game/components/ResignButton';

jest.mock('react-redux');
jest.mock('actions/resign');
jest.mock('reducers/selectors');

describe('ResignButton', () => {
  let store;
  let wrapper;

  beforeEach(() => {
    useDispatch.mockReturnValue(store.dispatch);
    useSelector.mockImplementation(callback => callback(store.getState()));
    getCurrentPlayer.mockReturnValue({ name: 'currentPlayer' });
    getOpponent.mockReturnValue({ name: 'opponent' });

    resign.send.mockReturnValue(() => {});

    wrapper = shallowWrappedComponent(<ResignButton />, store);
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
      wrapper.find('Button').simulate('click');

      expect(store.getActions()).toStrictEqual([
        actions.game.confirmingResign.set(true),
      ]);

      jest.runOnlyPendingTimers();

      expect(store.getActions()).toStrictEqual([
        actions.game.confirmingResign.set(true),
        actions.game.confirmingResign.set(false),
      ]);
    });
  });

  describe('confirmation button', () => {
    beforeAll(() => {
      store = mockStore({ confirmingResign: true });
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
      wrapper.find('Button').simulate('click');

      expect(resign.send).toHaveBeenCalledWith({
        io: null,
        gameSlug: undefined,
        username: 'currentPlayer',
      });
      expect(store.getActions()).toStrictEqual([
        actions.game.confirmingResign.set(false),
      ]);
    });
  });
});
