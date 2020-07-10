import React from 'react';
import { useSelector } from 'react-redux';

import Lobby from '../Lobby';

jest.mock('react-redux');

describe('Lobby', () => {
  const store = mockStore();

  let wrapper;

  beforeEach(() => {
    useSelector.mockImplementation(callback => callback(store.getState()));
    wrapper = shallowWrappedComponent(<Lobby />, store);
  });

  afterEach(() => {
    store.getActions();
    jest.resetAllMocks();
  });

  test('snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
