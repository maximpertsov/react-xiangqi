import flatten from 'lodash/flatten';
import { decode, isOccupied } from 'services/logic/fen';
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

  test('is occupied', () => {
    expect(isOccupied({ fen, square: 'a10' })).toBe(true);
    expect(isOccupied({ fen, square: 'a9' })).toBe(false);
  });
});
