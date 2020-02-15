import { encode, decode } from 'services/logic/square';

test('convert square to slot', () => {
  expect(decode("A10")).toBe(0);
});

test('convert slot to square', () => {
  expect(encode(0)).toBe("A10");
});
