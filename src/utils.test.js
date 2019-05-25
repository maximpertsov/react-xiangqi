import {
  fromFen, getSlot, getRank, getFile, legalMoves,
} from './utils';

test('convert rank-file to index', () => {
  expect(getSlot(0, 0)).toBe(0);
  expect(getSlot(5, 3)).toBe(48);
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
  expect(actual).toStrictEqual(expected);
});

function sameElements(actual, expected) {
  expect(actual).toEqual(expect.arrayContaining(expected));
  expect(expected).toEqual(expect.arrayContaining(actual));
}

const toSlots = (...rankFiles) => rankFiles.map((rf) => getSlot(...rf));

const legalMoveTests = [
  [
    '4k4/9/9/9/pp7/1p7/9/9/9/4K4',
    {
      [getSlot(4, 0)]: toSlots([5, 0]),
      [getSlot(4, 1)]: toSlots(),
      [getSlot(5, 1)]: toSlots([6, 1], [5, 2], [5, 0]),
    },
  ],
  [
    'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR',
    {
      [getSlot(3, 0)]: toSlots([4, 0]),
      [getSlot(3, 2)]: toSlots([4, 2]),
      [getSlot(3, 4)]: toSlots([4, 4]),
      [getSlot(3, 6)]: toSlots([4, 6]),
      [getSlot(3, 8)]: toSlots([4, 8]),
      [getSlot(6, 0)]: toSlots([5, 0]),
      [getSlot(6, 2)]: toSlots([5, 2]),
      [getSlot(6, 4)]: toSlots([5, 4]),
      [getSlot(6, 6)]: toSlots([5, 6]),
      [getSlot(6, 8)]: toSlots([5, 8]),
    },
  ],
];

test.each(legalMoveTests)('finds all legal moves for %s', (fen, expected) => {
  const actual = legalMoves(fromFen(fen));
  for (let i = 0; i < 90; i++) {
    if (Object.hasOwnProperty.call(expected, i)) {
      sameElements(actual[i], expected[i]);
    } else {
      sameElements(actual[i], toSlots());
    }
  }
});
