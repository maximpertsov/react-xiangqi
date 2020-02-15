import { decode } from 'services/logic/fen';

test('convert fen to board', () => {
  const fen =
    'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

  expect(decode(fen)).toBe(undefined);
});
