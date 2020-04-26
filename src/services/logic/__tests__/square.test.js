import {
  encode,
  encodeMove,
  moveToSquares,
  squaresToMove,
  decode,
  decodeMove,
} from 'services/logic/square';

test('convert square to slot', () => {
  expect(decode('a10')).toBe(0);
});

test('convert slot to square', () => {
  expect(encode(0)).toBe('a10');
});

test('convert squares to a move', () => {
  expect(squaresToMove('b10', 'c9')).toBe('b10c9');
});

test('convert move to squares', () => {
  expect(moveToSquares('b10c9')).toStrictEqual(['b10', 'c9']);
});

test('convert fromSlot, toSlot to a move', () => {
  expect(encodeMove(1, 11)).toBe('b10c9');
});

test('convert move to (fromSlot, toSlot)', () => {
  expect(decodeMove('b10c9')).toStrictEqual([1, 11]);
});
