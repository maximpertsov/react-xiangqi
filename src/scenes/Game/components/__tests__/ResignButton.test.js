import React from 'react';
import * as redux from 'react-redux';
import { shallow } from 'enzyme';
import values from 'lodash/values';
import * as selectors from 'reducers/selectors';

import actions from 'actions';
import resign from 'actions/resign';
import ResignButton from 'scenes/Game/components/ResignButton';

const getShallowWrappedComponent = store =>
  shallow(
    <redux.Provider store={store}>
      <ResignButton />
    </redux.Provider>,
  )
    .dive()
    .dive();

describe('ResignButton', () => {
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

    beforeEach(() => {
      spys.sendResign = jest.spyOn(resign, 'send');
      spys.sendResign.mockReturnValue(() => {});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
      wrapper.find('Button').simulate('click');

      expect(spys.sendResign).toHaveBeenCalledWith({
        gameSlug: undefined,
        username: 'currentPlayer',
      });
      expect(store.getActions()).toStrictEqual([
        actions.game.confirmingResign.set(false),
      ]);
    });
  });
});
