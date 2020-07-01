import React from 'react';
import MoveHistory from 'scenes/Game/components/MoveHistory';

describe('MoveHistory', () => {
  let store;
  let wrapper;
  let spys = {};

  beforeEach(() => {
    setupReduxSpys(spys, store);
    wrapper = shallowWrappedComponent(<MoveHistory />, store);
  });

  afterEach(() => {
    store.clearActions();
    restoreSpys(spys);
  });

  describe('render', () => {
    beforeAll(() => {
      store = mockStore({
        moves: [{ fen: 'FEN', uci: 'a1a2' }],
      });
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
