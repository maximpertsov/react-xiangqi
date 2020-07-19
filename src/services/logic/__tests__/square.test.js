import {
  decodeSquare,
  decodeUci,
  encodeSquare,
  encodeUci,
  squaresToUci,
  uciToSquares,
} from 'services/logic/square';

test('convert square to slot', () => {
  expect(decodeSquare('a10')).toBe(0);
});

test('convert slot to square', () => {
  expect(encodeSquare(0)).toBe('a10');
});

test('convert squares to a move', () => {
  expect(squaresToUci('b10', 'c9')).toBe('b10c9');
});

test('convert move to squares', () => {
  expect(uciToSquares('b10c9')).toStrictEqual(['b10', 'c9']);
});

test('convert fromSlot, toSlot to a move', () => {
  expect(encodeUci(1, 11)).toBe('b10c9');
});

test('convert move to (fromSlot, toSlot)', () => {
  expect(decodeUci('b10c9')).toStrictEqual([1, 11]);
});
