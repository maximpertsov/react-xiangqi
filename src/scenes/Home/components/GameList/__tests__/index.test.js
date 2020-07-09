import React from 'react';
import { useSelector } from 'react-redux';

import GameList from '..';

jest.mock('react-redux');

describe('GameList', () => {
  const store = mockStore({ games: [{ slug: 'abc123' }, { slug: 'zyx987' }] });

  let wrapper;

  beforeEach(() => {
    useSelector.mockImplementation(callback => callback(store.getState()));
    wrapper = shallowWrappedComponent(<GameList />, store);
  });

  afterEach(() => {
    store.getActions();
    jest.resetAllMocks();
  });

  test('snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
