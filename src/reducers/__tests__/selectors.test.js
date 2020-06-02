import { Color } from 'services/logic/constants';
import {
  getSelectedMove,
  getPreviousMoveFen,
  getNextMoveFen,
  getNextMovePlayer,
  getUserColor,
  getCurrentPlayer,
  getOpponent,
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

describe('players', () => {
  const state = {
    redPlayer: { name: 'alice' },
    blackPlayer: { name: 'bob' },
  };

  test('next player is red', () => {
    const moves = [{ fen: 'FEN0 w' }];
    expect(getNextMovePlayer({ ...state, moves })).toStrictEqual({
      name: 'alice',
    });
  });

  test('next player is black', () => {
    const moves = [{ fen: 'FEN1 b' }, { fen: 'FEN0 w' }];
    expect(getNextMovePlayer({ ...state, moves })).toStrictEqual({
      name: 'bob',
    });
  });

  test('user player is red', () => {
    const newState = { ...state, username: 'alice' };

    expect(getUserColor(newState)).toBe(Color.RED);
    expect(getCurrentPlayer(newState)).toStrictEqual({ name: 'alice' });
    expect(getOpponent(newState)).toStrictEqual({ name: 'bob' });
  });

  test('current player is black', () => {
    const newState = { ...state, username: 'bob' };

    expect(getUserColor(newState)).toBe(Color.BLACK);
    expect(getCurrentPlayer(newState)).toStrictEqual({ name: 'bob' });
    expect(getOpponent(newState)).toStrictEqual({ name: 'alice' });
  });
});
