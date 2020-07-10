import React from 'react';
import { useSelector } from 'react-redux';

import NewGameMenu from '../NewGameMenu';

jest.mock('react-redux');

describe('NewGameMenu', () => {
  let store;
  let wrapper;

  beforeEach(() => {
    useSelector.mockImplementation(callback => callback(store.getState()));
    wrapper = shallowWrappedComponent(<NewGameMenu />, store);
  });

  afterEach(() => {
    store.getActions();
    jest.resetAllMocks();
  });

  describe('did not make game request', () => {
    beforeAll(() => {
      store = mockStore({
        lobbyGames: [],
        username: 'alice',
      });
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('already made game request', () => {
    beforeAll(() => {
      store = mockStore({
        lobbyGames: [{ id: 789, player1: 'alice', parameters: {} }],
        username: 'alice',
      });
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
