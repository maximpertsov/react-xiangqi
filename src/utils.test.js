import {
  fromFen, getIndex, getRank, getFile, legalMoves,
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

test('finds all legal moves', () => {
  const fen = '9/9/9/9/1p7/1p7/9/9/9/9';
  const actual = legalMoves(fromFen(fen));
  const expected = {};
  expected[getIndex(4, 1)] = [];
  expected[getIndex(5, 1)] = [getIndex(6, 1), getIndex(5, 0), getIndex(5, 2)];
  for (let i = 0; i < 90; i++) {
    if (Object.hasOwnProperty.call(expected, i)) {
      console.log(getRank(i), getFile(i), actual[i], expected[i]);
      expect(actual[i]).toStrictEqual(expected[i]);
    } else {
      expect(actual[i]).toStrictEqual([]);
    }
  }
});
