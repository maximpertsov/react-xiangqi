import {
  getBottomPlayerIsRed,
  getCurrentPlayer,
  getLastMessage,
  getNextMoveFen,
  getNextMovePlayer,
  getOpponent,
  getPreviousMoveFen,
  getSelectedMove,
  getUserTeam,
} from 'reducers/selectors';
import { Team } from 'services/logic/constants';

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
    player1: { name: 'alice' },
    player2: { name: 'bob' },
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

    expect(getUserTeam(newState)).toBe(Team.RED);
    expect(getCurrentPlayer(newState)).toStrictEqual({ name: 'alice' });
    expect(getOpponent(newState)).toStrictEqual({ name: 'bob' });
    expect(getBottomPlayerIsRed(newState)).toBe(true);
  });

  test('current player is black', () => {
    const newState = { ...state, username: 'bob' };

    expect(getUserTeam(newState)).toBe(Team.BLACK);
    expect(getCurrentPlayer(newState)).toStrictEqual({ name: 'bob' });
    expect(getOpponent(newState)).toStrictEqual({ name: 'alice' });
    expect(getBottomPlayerIsRed(newState)).toBe(false);
  });
});

describe('messages', () => {
  const state = {
    messages: [
      {
        type: 'move',
      },
      {
        type: 'joined_lobby_game',
      },
    ],
  };

  test('last message', () => {
    expect(getLastMessage(state)).toStrictEqual({
      type: 'joined_lobby_game',
    });
  });
});
