import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import BoardView from 'components/Board/components/BoardView';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  animationOffset: [0, 0],
  moves: [
    {
      id: 0,
      // TODO: mock decode fen
      fen:
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1',
      move: null,
    },
  ],
});

describe('BoardView', () => {
  test('renders without crashing', () => {
    const wrapper = render(
      <Provider store={store}>
        <BoardView handleSquareClick={() => {}} />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
