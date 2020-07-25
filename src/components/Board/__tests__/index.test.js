import React from 'react';
import { useSelector } from 'react-redux';

import Board from '..';

jest.mock('react-redux');
jest.mock('reducers/selectors');

describe('Board', () => {
  const move = {
    fen:
      'rnbak1bnr/4a4/1c5c1/p1p1p1p1p/9/2P3P2/P3P3P/1C5C1/9/RNBAKABNR b - - 3 2',
    givesCheck: false,
    uci: 'g4g5',
  };
  let store;
  let wrapper;

  beforeEach(() => {
    store = mockStore({});
    useSelector.mockImplementation(callback => callback(store.getState()));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('bottom player has red pieces', () => {
    beforeEach(() => {
      wrapper = shallowWrappedComponent(<Board move={move} />, store);
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('bottom player has black pieces', () => {
    beforeEach(() => {
      wrapper = shallowWrappedComponent(
        <Board teamBlackPOV move={move} />,
        store,
      );
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
