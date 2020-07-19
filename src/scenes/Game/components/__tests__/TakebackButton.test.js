import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import takeback from 'actions/takeback';
import { getCurrentPlayer, getOpponent } from 'reducers/selectors';
import TakebackButton from 'scenes/Game/components/TakebackButton';

jest.mock('react-redux');
jest.mock('actions/takeback');
jest.mock('reducers/selectors');

describe('TakebackButton', () => {
  let store;
  let wrapper;

  beforeEach(() => {
    useDispatch.mockReturnValue(store.dispatch);
    useSelector.mockImplementation(callback => callback(store.getState()));
    getCurrentPlayer.mockReturnValue({ name: 'currentPlayer' });
    getOpponent.mockReturnValue({ name: 'opponent' });

    takeback.request.mockReturnValue(() => {});
    takeback.reject.mockReturnValue(() => {});
    takeback.accept.mockReturnValue(() => {});
    takeback.cancel.mockReturnValue(() => {});

    wrapper = shallowWrappedComponent(<TakebackButton />, store);
  });

  afterEach(() => {
    store.clearActions();
    jest.resetAllMocks();
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

      expect(takeback.request).toHaveBeenCalledWith({
        io: null,
        gameSlug: undefined,
        username: 'currentPlayer',
      });
      expect(store.getActions()).toStrictEqual([]);
    });
  });

  describe('cancel button', () => {
    beforeAll(() => {
      store = mockStore({ openTakebackOffer: 'currentPlayer' });
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
      wrapper.find('Button').simulate('click');

      expect(takeback.cancel).toHaveBeenCalledWith({
        io: null,
        gameSlug: undefined,
        username: 'currentPlayer',
      });
      expect(store.getActions()).toStrictEqual([]);
    });
  });

  describe('accept or reject button', () => {
    beforeAll(() => {
      store = mockStore({ openTakebackOffer: 'opponent' });
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click accept', () => {
      wrapper
        .find('Button')
        .find({ color: 'green' })
        .simulate('click');

      expect(takeback.accept).toHaveBeenCalledWith({
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

      expect(takeback.reject).toHaveBeenCalledWith({
        io: null,
        gameSlug: undefined,
        username: 'currentPlayer',
      });
      expect(store.getActions()).toStrictEqual([]);
    });
  });
});
