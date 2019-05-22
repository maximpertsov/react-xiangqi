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

function sameElements(actual, expected) {
  expect(actual).toEqual(expect.arrayContaining(expected));
  expect(expected).toEqual(expect.arrayContaining(actual));
}

const Slots = (...rankFiles) => rankFiles.map((rf) => getIndex(...rf));

test('finds all legal moves', () => {
  const fen = '4k4/9/9/9/pp7/1p7/9/9/9/4K4';
  const actual = legalMoves(fromFen(fen));
  const expected = {};
  expected[getIndex(4, 0)] = Slots([5, 0]);
  expected[getIndex(4, 1)] = Slots();
  expected[getIndex(5, 1)] = Slots([6, 1], [5, 2], [5, 0]);
  for (let i = 0; i < 90; i++) {
    if (Object.hasOwnProperty.call(expected, i)) {
      sameElements(actual[i], expected[i]);
    } else {
      sameElements(actual[i], Slots());
    }
  }
});
