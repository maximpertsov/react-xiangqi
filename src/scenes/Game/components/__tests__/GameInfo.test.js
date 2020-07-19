import React from 'react';
import * as redux from 'react-redux';
import values from 'lodash/values';

import { shallow } from 'enzyme';
import * as selectors from 'reducers/selectors';
import GameInfo from 'scenes/Game/components/GameInfo';

const defaultState = {
  player1: { name: 'alice' },
  player2: { name: 'bob' },
};

const getShallowWrappedComponent = store =>
  shallow(
    <redux.Provider store={store}>
      <GameInfo />
    </redux.Provider>,
  )
    .dive()
    .dive();

describe('GameInfo', () => {
  let store;
  let wrapper;
  let spys = {};

  beforeEach(() => {
    spys.useSelector = jest.spyOn(redux, 'useSelector');
    spys.useSelector.mockImplementation(callback => callback(store.getState()));

    spys.getCurrentPlayer = jest.spyOn(selectors, 'getCurrentPlayer');
    spys.getCurrentPlayer.mockReturnValue({ name: 'alice' });

    wrapper = getShallowWrappedComponent(store);
  });

  afterEach(() => {
    store.clearActions();
    values(spys).forEach(spy => spy.mockRestore());
  });

  describe('Your turn', () => {
    beforeAll(() => {
      store = mockStore({ ...defaultState });

      spys.getNextMovePlayer = jest.spyOn(selectors, 'getNextMovePlayer');
      spys.getNextMovePlayer.mockImplementation(() => ({ name: 'alice' }));
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Waiting for opponent', () => {
    beforeAll(() => {
      store = mockStore({ ...defaultState });

      spys.getNextMovePlayer = jest.spyOn(selectors, 'getNextMovePlayer');
      spys.getNextMovePlayer.mockImplementation(() => ({ name: 'bob' }));
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Player 1 (Alice) wins', () => {
    beforeAll(() => {
      store = mockStore({
        ...defaultState,
        score1: 1,
      });
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Player 2 (Bob) wins', () => {
    beforeAll(() => {
      store = mockStore({
        ...defaultState,
        score2: 1,
      });
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Draw', () => {
    beforeAll(() => {
      store = mockStore({
        ...defaultState,
        score1: 0.5,
        score2: 0.5,
      });
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
