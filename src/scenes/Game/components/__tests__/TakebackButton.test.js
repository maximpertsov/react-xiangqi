import React from 'react';
import * as redux from 'react-redux';
import { shallow } from 'enzyme';
import values from 'lodash/values';
import * as selectors from 'reducers/selectors';

import takeback from 'actions/takeback';
import TakebackButton from 'scenes/Game/components/TakebackButton';

const getShallowWrappedComponent = store =>
  shallow(
    <redux.Provider store={store}>
      <TakebackButton />
    </redux.Provider>,
  )
    .dive()
    .dive();

describe('TakebackButton', () => {
  let store;
  let wrapper;
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

    wrapper = getShallowWrappedComponent(store);
  });

  afterEach(() => {
    store.clearActions();
    values(spys).forEach(spy => spy.mockRestore());
  });

  describe('default button', () => {
    beforeAll(() => {
      store = mockStore({});
    });

    beforeEach(() => {
      spys.requestTakeback = jest.spyOn(takeback, 'request');
      spys.requestTakeback.mockReturnValue(() => {});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
      wrapper.find('Button').simulate('click');

      expect(spys.requestTakeback).toHaveBeenCalledWith({
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

    beforeEach(() => {
      spys.cancelTakeback = jest.spyOn(takeback, 'cancel');
      spys.cancelTakeback.mockReturnValue(() => {});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
      wrapper.find('Button').simulate('click');

      expect(spys.cancelTakeback).toHaveBeenCalledWith({
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

    beforeEach(() => {
      spys.acceptTakeback = jest.spyOn(takeback, 'accept');
      spys.acceptTakeback.mockReturnValue(() => {});
      spys.rejectTakeback = jest.spyOn(takeback, 'reject');
      spys.rejectTakeback.mockReturnValue(() => {});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click accept', () => {
      wrapper
        .find('Button')
        .find({ color: 'green' })
        .simulate('click');

      expect(spys.acceptTakeback).toHaveBeenCalledWith({
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

      expect(spys.rejectTakeback).toHaveBeenCalledWith({
        gameSlug: undefined,
        username: 'currentPlayer',
      });
      expect(store.getActions()).toStrictEqual([]);
    });
  });
});
