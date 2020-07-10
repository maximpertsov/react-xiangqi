import React from 'react';
import { useSelector } from 'react-redux';

import Lobby from '../Lobby';

jest.mock('react-redux');

describe('Lobby', () => {
  const store = mockStore({
    lobbyGames: [
      { id: 123, player1: 'bob', parameters: {} },
      { id: 789, player1: 'alice', parameters: {} },
    ],
    username: 'alice',
  });

  let wrapper;

  beforeEach(() => {
    useSelector.mockImplementation(callback => callback(store.getState()));
    wrapper = shallowWrappedComponent(<Lobby />, store);
  });

  afterEach(() => {
    store.clearActions();
    jest.resetAllMocks();
  });

  test('snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
