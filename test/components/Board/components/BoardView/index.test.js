import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import BoardView from 'components/Board/components/BoardView';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  autoMove: ['black'],
  games: [],
  gameSlug: null,
  loginForm: {
    username: '',
    password: '',
    error: '',
    loading: false,
  },
  showGame: true,
  username: null,
  moves: [
    {
      id: 0,
      givesCheck: false,
      fen:
        'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1',
      legalMoves: {
        a1a2:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/R8/1NBAKABNR b - - 1 1',
        a1a3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/RC5C1/9/1NBAKABNR b - - 1 1',
        i1i2:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/8R/RNBAKABN1 b - - 1 1',
        i1i3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5CR/9/RNBAKABN1 b - - 1 1',
        d1e2:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4A4/RNB1KABNR b - - 1 1',
        f1e2:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4A4/RNBAK1BNR b - - 1 1',
        b3b2:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/7C1/1C7/RNBAKABNR b - - 1 1',
        b3a3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/C6C1/9/RNBAKABNR b - - 1 1',
        b3c3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/2C4C1/9/RNBAKABNR b - - 1 1',
        b3d3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/3C3C1/9/RNBAKABNR b - - 1 1',
        b3e3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/4C2C1/9/RNBAKABNR b - - 1 1',
        b3f3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/5C1C1/9/RNBAKABNR b - - 1 1',
        b3g3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/6CC1/9/RNBAKABNR b - - 1 1',
        b3b4:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/PCP1P1P1P/7C1/9/RNBAKABNR b - - 1 1',
        b3b5:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/1C7/P1P1P1P1P/7C1/9/RNBAKABNR b - - 1 1',
        b3b6:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/1C7/9/P1P1P1P1P/7C1/9/RNBAKABNR b - - 1 1',
        b3b7:
          'rnbakabnr/9/1c5c1/pCp1p1p1p/9/9/P1P1P1P1P/7C1/9/RNBAKABNR b - - 1 1',
        b3b10:
          'rCbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/7C1/9/RNBAKABNR b - - 0 1',
        h3h2:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C7/7C1/RNBAKABNR b - - 1 1',
        h3c3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1CC6/9/RNBAKABNR b - - 1 1',
        h3d3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C1C5/9/RNBAKABNR b - - 1 1',
        h3e3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C2C4/9/RNBAKABNR b - - 1 1',
        h3f3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C3C3/9/RNBAKABNR b - - 1 1',
        h3g3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C4C2/9/RNBAKABNR b - - 1 1',
        h3i3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C6C/9/RNBAKABNR b - - 1 1',
        h3h4:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1PCP/1C7/9/RNBAKABNR b - - 1 1',
        h3h5:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/7C1/P1P1P1P1P/1C7/9/RNBAKABNR b - - 1 1',
        h3h6:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/7C1/9/P1P1P1P1P/1C7/9/RNBAKABNR b - - 1 1',
        h3h7:
          'rnbakabnr/9/1c5c1/p1p1p1pCp/9/9/P1P1P1P1P/1C7/9/RNBAKABNR b - - 1 1',
        h3h10:
          'rnbakabCr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C7/9/RNBAKABNR b - - 0 1',
        a4a5:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/P8/2P1P1P1P/1C5C1/9/RNBAKABNR b - - 1 1',
        c4c5:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/2P6/P3P1P1P/1C5C1/9/RNBAKABNR b - - 1 1',
        e4e5:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/4P4/P1P3P1P/1C5C1/9/RNBAKABNR b - - 1 1',
        g4g5:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/6P2/P1P1P3P/1C5C1/9/RNBAKABNR b - - 1 1',
        i4i5:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/8P/P1P1P1P2/1C5C1/9/RNBAKABNR b - - 1 1',
        b1a3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/NC5C1/9/R1BAKABNR b - - 1 1',
        b1c3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1CN4C1/9/R1BAKABNR b - - 1 1',
        h1g3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C4NC1/9/RNBAKAB1R b - - 1 1',
        h1i3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5CN/9/RNBAKAB1R b - - 1 1',
        c1a3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/BC5C1/9/RN1AKABNR b - - 1 1',
        c1e3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C2B2C1/9/RN1AKABNR b - - 1 1',
        g1e3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C2B2C1/9/RNBAKA1NR b - - 1 1',
        g1i3:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5CB/9/RNBAKA1NR b - - 1 1',
        e1e2:
          'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RNBA1ABNR b - - 1 1',
      },
      move: null,
      pending: false,
    },
  ],
  players: [
    {
      color: 'red',
    },
    {
      color: 'black',
    },
  ],
  requestedTakeback: false,
  selectedMoveId: null,
  updateCount: -1,
  animationOffset: [0, 0],
  canMoveBothColors: false,
  selectedSquare: null,
});

describe('BoardView', () => {
  test('renders without crashing', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <BoardView handleSquareClick={() => {}} />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});