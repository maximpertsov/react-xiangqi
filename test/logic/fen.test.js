import { decode } from 'services/logic/fen';

test('convert fen to board', () => {
  const fen =
    'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

  const expectedPlacement = [
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
  ].flat();

  expect(decode(fen)).toMatchObject({
    placement: expectedPlacement,
    activeColor: 'w',
    castling: '-',
    enPassant: '-',
    halfmoves: 0,
    fullmoves: 0,
  });
});
