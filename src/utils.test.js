import { fromFen } from './utils';

const RANKS = 10;
const FILES = 9;

test('converts FEN string to an array', () => {
  const fen = 'rheakaehr/9/2c3c2/p1p1p1p1p/9/9/P1P1P1P1P/2C3C2/9/RHEAKAEHR';
  const expected = [
    'r', 'h', 'e', 'a', 'k', 'a', 'e', 'h', 'r',
    ...Array(9).fill(null),
    null, null, 'c', null, null, null, 'c', null, null,
    'p', null, 'p', null, 'p', null, 'p', null, 'p',
    ...Array(9).fill(null),
    ...Array(9).fill(null),
    'P', null, 'P', null, 'P', null, 'P', null, 'P',
    null, null, 'C', null, null, null, 'C', null, null,
    ...Array(9).fill(null),
    'R', 'H', 'E', 'A', 'K', 'A', 'E', 'H', 'R',
  ];
  const actual = fromFen(fen);
  for (let i = 0; i < RANKS * FILES; i++) {
    expect(actual[i]).toBe(expected[i]);
  }
});
