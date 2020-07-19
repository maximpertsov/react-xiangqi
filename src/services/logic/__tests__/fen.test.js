import flatten from 'lodash/flatten';

import { Team } from 'services/logic/constants';
import {
  activeKing,
  activeTeam,
  decodeFen,
  getPiece,
  isOccupied,
  moveOrder,
  sameTeam,
} from 'services/logic/fen';

describe('fen functions', () => {
  const initialFen =
    'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';
  const rookMoveFen =
    '1nbakabnr/r8/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR b - - 0 1';

  test('convert fen to board', () => {
    expect(decodeFen(initialFen)).toMatchObject({
      placement: flatten([
        ['r', 'n', 'b', 'a', 'k', 'a', 'b', 'n', 'r'],
        Array(9).fill(null),
        [null, 'c', null, null, null, null, null, 'c', null],
        ['p', null, 'p', null, 'p', null, 'p', null, 'p'],
        Array(9).fill(null),
        Array(9).fill(null),
        ['P', null, 'P', null, 'P', null, 'P', null, 'P'],
        [null, 'C', null, null, null, null, null, 'C', null],
        Array(9).fill(null),
        ['R', 'N', 'B', 'A', 'K', 'A', 'B', 'N', 'R'],
      ]),
      activeTeam: Team.RED,
      castling: '-',
      enPassant: '-',
      halfmoves: 0,
      fullmoves: 1,
    });

    expect(decodeFen(rookMoveFen)).toMatchObject({
      placement: flatten([
        [null, 'n', 'b', 'a', 'k', 'a', 'b', 'n', 'r'],
        ['r', ...Array(8).fill(null)],
        [null, 'c', null, null, null, null, null, 'c', null],
        ['p', null, 'p', null, 'p', null, 'p', null, 'p'],
        Array(9).fill(null),
        Array(9).fill(null),
        ['P', null, 'P', null, 'P', null, 'P', null, 'P'],
        [null, 'C', null, null, null, null, null, 'C', null],
        Array(9).fill(null),
        ['R', 'N', 'B', 'A', 'K', 'A', 'B', 'N', 'R'],
      ]),
      activeTeam: Team.BLACK,
      castling: '-',
      enPassant: '-',
      halfmoves: 0,
      fullmoves: 1,
    });
  });

  test('get piece', () => {
    expect(getPiece(initialFen, 'a10')).toBe('r');
    expect(getPiece(initialFen, 'a9')).toBe(null);

    expect(getPiece(rookMoveFen, 'a10')).toBe(null);
    expect(getPiece(rookMoveFen, 'a9')).toBe('r');
  });

  test('active team', () => {
    expect(activeTeam(initialFen)).toBe(Team.RED);
    expect(activeTeam(rookMoveFen)).toBe(Team.BLACK);
  });

  test('is occupied', () => {
    expect(isOccupied(initialFen, 'a10')).toBe(true);
    expect(isOccupied(initialFen, 'a9')).toBe(false);

    expect(isOccupied(rookMoveFen, 'a10')).toBe(false);
    expect(isOccupied(rookMoveFen, 'a9')).toBe(true);
  });

  test('is same team', () => {
    // two black pieces
    expect(sameTeam(initialFen, 'a10', 'b10')).toBe(true);
    // Two red pieces
    expect(sameTeam(initialFen, 'a1', 'b1')).toBe(true);
    // black and red piece
    expect(sameTeam(initialFen, 'a10', 'a1')).toBe(false);
    // black and unoccupied
    expect(sameTeam(initialFen, 'a10', 'a9')).toBe(false);
    // two unoccupied squares
    expect(sameTeam(initialFen, 'a9', 'b9')).toBe(false);
  });

  test('is active king', () => {
    expect(activeKing(initialFen)).toBe('e1');
    expect(activeKing(rookMoveFen)).toBe('e10');
  });

  test('move order', () => {
    expect(moveOrder(initialFen)).toBe(1);
    expect(moveOrder(rookMoveFen)).toBe(2);
  });
});
