import { encode, encodeMove, decode } from 'services/logic/square';

test('convert square to slot', () => {
  expect(decode('A10')).toBe(0);
});

test('convert slot to square', () => {
  expect(encode(0)).toBe('A10');
});

test('convert fromSlot, toSlot to a move', () => {
  expect(encodeMove(0, 11)).toBe('A10B9');
});
