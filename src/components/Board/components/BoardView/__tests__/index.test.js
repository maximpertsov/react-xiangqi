import React from 'react';
import { useSelector } from 'react-redux';
import { getBottomPlayerIsRed } from 'reducers/selectors';

import BoardView from '..';

jest.mock('react-redux');
jest.mock('reducers/selectors');

describe('BoardView', () => {
  const store = mockStore({
    selectedFen:
      'rnbak1bnr/4a4/1c5c1/p1p1p1p1p/9/2P3P2/P3P3P/1C5C1/9/RNBAKABNR b - - 3 2',
  });

  let wrapper;

  beforeEach(() => {
    useSelector.mockImplementation(callback => callback(store.getState()));
    wrapper = shallowWrappedComponent(<BoardView />, store);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('bottom player has red pieces', () => {
    beforeAll(() => {
      getBottomPlayerIsRed.mockReturnValue(true);
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('bottom player has black pieces', () => {
    beforeAll(() => {
      getBottomPlayerIsRed.mockReturnValue(false);
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
