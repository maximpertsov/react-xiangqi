import { fromFen } from './utils';

const RANKS = 10;
const FILES = 9;

test('converts FEN string to an array', () => {
  const fen = 'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR';
  const expected = [
    'r', 'h', 'e', 'a', 'k', 'a', 'e', 'h', 'r',
    ...Array(9).fill(null),
    null, 'c', null, null, null, null, null, 'c', null,
    'p', null, 'p', null, 'p', null, 'p', null, 'p',
    ...Array(9).fill(null),
    ...Array(9).fill(null),
    'P', null, 'P', null, 'P', null, 'P', null, 'P',
    null, 'C', null, null, null, null, null, 'C', null,
    ...Array(9).fill(null),
    'R', 'H', 'E', 'A', 'K', 'A', 'E', 'H', 'R',
  ];
  const actual = fromFen(fen);
  for (let i = 0; i < RANKS * FILES; i++) {
    expect(actual[i]).toBe(expected[i]);
  }
});
