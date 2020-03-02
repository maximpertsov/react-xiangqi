import flatten from 'lodash/flatten';
import { decode } from 'services/logic/fen';
import { makeMove, getMovingPiece } from 'services/logic/move';

describe('placement moves', () => {
  const move = 'a10a9';
  const fen =
    'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';
  const initialPlacement = decode(fen).placement;

  test('update board placement by move', () => {
    const expectedPlacement = flatten([
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
    ]);

    expect(makeMove(initialPlacement, move)).toStrictEqual(expectedPlacement);
  });

  test('get moving piece', () => {
    expect(getMovingPiece(initialPlacement, move)).toEqual('r');
  });
});
