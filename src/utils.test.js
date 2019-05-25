import {
  fromFen, getSlot, getRank, getFile, legalMoves,
} from './utils';

const slotRankFileTests = [
  [0, 0, 0],
  [1, 0, 1],
  [2, 0, 2],
  [3, 0, 3],
  [4, 0, 4],
  [5, 0, 5],
  [6, 0, 6],
  [7, 0, 7],
  [8, 0, 8],
  [9, 1, 0],
  [10, 1, 1],
  [11, 1, 2],
  [12, 1, 3],
  [13, 1, 4],
  [14, 1, 5],
  [15, 1, 6],
  [16, 1, 7],
  [17, 1, 8],
  [18, 2, 0],
  [19, 2, 1],
  [20, 2, 2],
  [21, 2, 3],
  [22, 2, 4],
  [23, 2, 5],
  [24, 2, 6],
  [25, 2, 7],
  [26, 2, 8],
  [27, 3, 0],
  [28, 3, 1],
  [29, 3, 2],
  [30, 3, 3],
  [31, 3, 4],
  [32, 3, 5],
  [33, 3, 6],
  [34, 3, 7],
  [35, 3, 8],
  [36, 4, 0],
  [37, 4, 1],
  [38, 4, 2],
  [39, 4, 3],
  [40, 4, 4],
  [41, 4, 5],
  [42, 4, 6],
  [43, 4, 7],
  [44, 4, 8],
  [45, 5, 0],
  [46, 5, 1],
  [47, 5, 2],
  [48, 5, 3],
  [49, 5, 4],
  [50, 5, 5],
  [51, 5, 6],
  [52, 5, 7],
  [53, 5, 8],
  [54, 6, 0],
  [55, 6, 1],
  [56, 6, 2],
  [57, 6, 3],
  [58, 6, 4],
  [59, 6, 5],
  [60, 6, 6],
  [61, 6, 7],
  [62, 6, 8],
  [63, 7, 0],
  [64, 7, 1],
  [65, 7, 2],
  [66, 7, 3],
  [67, 7, 4],
  [68, 7, 5],
  [69, 7, 6],
  [70, 7, 7],
  [71, 7, 8],
  [72, 8, 0],
  [73, 8, 1],
  [74, 8, 2],
  [75, 8, 3],
  [76, 8, 4],
  [77, 8, 5],
  [78, 8, 6],
  [79, 8, 7],
  [80, 8, 8],
  [81, 9, 0],
  [82, 9, 1],
  [83, 9, 2],
  [84, 9, 3],
  [85, 9, 4],
  [86, 9, 5],
  [87, 9, 6],
  [88, 9, 7],
  [89, 9, 8],
];

test.each(slotRankFileTests)('convert slot (%i) to [rank, file]([%i, %i])', (slot, rank, file) => {
  expect(getRank(slot)).toBe(rank);
  expect(getFile(slot)).toBe(file);
  expect(getSlot(rank, file)).toBe(slot);
});

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
