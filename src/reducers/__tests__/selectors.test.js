import {
  getSelectedMove,
  getPreviousMoveFen,
  getNextMoveFen,
} from 'reducers/selectors';

jest.mock('services/logic/fen');

describe('get selected move', () => {
  const state = {
    selectedFen: 'FEN1',
    moves: [
      { fen: 'FEN0', uci: null },
      { fen: 'FEN2', uci: 'a10a9' },
      { fen: 'FEN1', uci: 'a1a2' },
    ],
  };

  test('get selected fen', () => {
    expect(getSelectedMove(state)).toStrictEqual({
      fen: 'FEN1',
      uci: 'a1a2',
    });
  });

  test('selected fen is null', () => {
    expect(getSelectedMove({ ...state, selectedFen: null })).toStrictEqual({});
  });
});

describe('get moves around selected fen', () => {
  const state = {
    selectedFen: 'FEN1',
    moves: [
      { fen: 'FEN0', uci: null },
      { fen: 'FEN2', uci: 'a10a9' },
      { fen: 'FEN1', uci: 'a1a2' },
    ],
  };

  test('get previous move fen', () => {
    expect(getPreviousMoveFen(state)).toEqual('FEN0');
  });

  test('get next move fen', () => {
    expect(getNextMoveFen(state)).toEqual('FEN2');
  });

  test('previous move when at first move', () => {
    const newState = { ...state, selectedFen: 'FEN0' };
    expect(getPreviousMoveFen(newState)).toEqual('FEN0');
  });

  test('next move when at last move', () => {
    const newState = { ...state, selectedFen: 'FEN2' };
    expect(getNextMoveFen(newState)).toEqual('FEN2');
  });

  // TODO: what if there is a gap in moves?
});
