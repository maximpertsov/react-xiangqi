import React from 'react';
import * as redux from 'react-redux';
import { shallow } from 'enzyme';
import values from 'lodash/values';
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
      store = mockStore(defaultState);

      spys.getNextMovePlayer = jest.spyOn(selectors, 'getNextMovePlayer');
      spys.getNextMovePlayer.mockReturnValue({ name: 'alice' });
      console.log("your turn mock set");
    });

    test('snapshot', () => {
      console.log("your turn test");
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Waiting for opponent', () => {
    beforeAll(() => {
      store = mockStore(defaultState);

      spys.getNextMovePlayer = jest.spyOn(selectors, 'getNextMovePlayer');
      spys.getNextMovePlayer.mockReturnValue({ name: 'bob' });
      console.log("waiting mock");
    });

    test('snapshot', () => {
      console.log("waiting test");
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Player 1 (Alice) wins', () => {
    beforeAll(() => {
      store = mockStore({
        ...defaultState,
        score1: 1,
      });
      console.log("p1 wins mock");
    });

    test('snapshot', () => {
      console.log("p1 wins test");
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Player 2 (Bob) wins', () => {
    beforeAll(() => {
      store = mockStore({
        ...defaultState,
        score2: 1,
      });
      console.log("p2 wins mock");
    });

    test('snapshot', () => {
      console.log("p2 wins test");
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
      console.log("draw mock");
    });

    test('snapshot', () => {
      console.log("draw test");
      expect(wrapper).toMatchSnapshot();
    });
  });
});
