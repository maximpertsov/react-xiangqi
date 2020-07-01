import React from 'react';
import * as selectors from 'reducers/selectors';

import actions from 'actions';
import resign from 'actions/resign';
import ResignButton from 'scenes/Game/components/ResignButton';

describe('ResignButton', () => {
  let store;
  let wrapper;
  let spys = {};

  beforeEach(() => {
    setupReduxSpys(spys, store);

    spys.getCurrentPlayer = jest.spyOn(selectors, 'getCurrentPlayer');
    spys.getCurrentPlayer.mockReturnValue({ name: 'currentPlayer' });

    wrapper = shallowWrappedComponent(<ResignButton />, store);
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
