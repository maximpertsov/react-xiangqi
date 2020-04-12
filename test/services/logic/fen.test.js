import flatten from 'lodash/flatten';
import {
  activeKing,
  decode,
  getPiece,
  isOccupied,
  sameColor,
} from 'services/logic/fen';
import { Color } from 'services/logic/constants';

describe('fen functions', () => {
  const fen =
    'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

  test('convert fen to board', () => {
    const expectedPlacement = flatten([
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
    ]);

    expect(decode(fen)).toMatchObject({
      placement: expectedPlacement,
      activeColor: Color.RED,
      castling: '-',
      enPassant: '-',
      halfmoves: 0,
      fullmoves: 1,
    });
  });

  test('get piece', () => {
    expect(getPiece(fen, 'a10')).toBe('r');
    expect(getPiece(fen, 'a9')).toBe(null);
  });

  test('is occupied', () => {
    expect(isOccupied(fen, 'a10')).toBe(true);
    expect(isOccupied(fen, 'a9')).toBe(false);
  });

  test('is same color', () => {
    // two black pieces
    expect(sameColor(fen, 'a10', 'b10')).toBe(true);
    // Two red pieces
    expect(sameColor(fen, 'a1', 'b1')).toBe(true);
    // black and red piece
    expect(sameColor(fen, 'a10', 'a1')).toBe(false);
    // black and unoccupied
    expect(sameColor(fen, 'a10', 'a9')).toBe(false);
    // two unoccupied squares
    expect(sameColor(fen, 'a9', 'b9')).toBe(false);
  });

  test('is active king', () => {
    expect(activeKing(fen)).toBe('e1');

    const newFen =
      '1nbakabnr/r8/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR b - - 0 1';
    expect(activeKing(newFen)).toBe('e10');
  });
});
