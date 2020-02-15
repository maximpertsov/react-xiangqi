import { encode, encodeMove, decode, decodeMove } from 'services/logic/square';

test('convert square to slot', () => {
  expect(decode('A10')).toBe(0);
});

test('convert slot to square', () => {
  expect(encode(0)).toBe('A10');
});

test('convert fromSlot, toSlot to a move', () => {
  expect(encodeMove(1, 11)).toBe('B10C9');
});

test('convert move to (fromSlot, toSlot)', () => {
  expect(decodeMove('B10C9')).toBe([1, 11]);
});
