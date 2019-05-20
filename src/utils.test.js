import {
  fromFen, getIndex, getRank, getFile,
} from './utils';

test('convert rank-file to index', () => {
  expect(getIndex(0, 0)).toBe(0);
  expect(getIndex(5, 3)).toBe(48);
});

test('convert index to rank', () => {
  expect(getRank(0)).toBe(0);
  expect(getRank(48)).toBe(5);
});

test('convert index to file', () => {
  expect(getFile(0)).toBe(0);
  expect(getFile(48)).toBe(3);
});

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
  for (let i = 0; i < 90; i++) {
    expect(actual[i]).toBe(expected[i]);
  }
});
