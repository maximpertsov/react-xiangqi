import XiangqiBoard from './logic';

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

test.each(slotRankFileTests)(
  'convert slot (%i) to [rank, file]([%i, %i])',
  (slot, rank, file) => {
    const xb = new XiangqiBoard();
    expect(xb.getRank(slot)).toBe(rank);
    expect(xb.getFile(slot)).toBe(file);
    expect(xb.getSlot(rank, file)).toBe(slot);
  },
);

test('convert rank-file to index', () => {
  const xb = new XiangqiBoard();
  expect(xb.getSlot(0, 0)).toBe(0);
  expect(xb.getSlot(5, 3)).toBe(48);
});

test('convert index to rank', () => {
  const xb = new XiangqiBoard();
  expect(xb.getRank(0)).toBe(0);
  expect(xb.getRank(48)).toBe(5);
});

test('convert index to file', () => {
  const xb = new XiangqiBoard();
  expect(xb.getFile(0)).toBe(0);
  expect(xb.getFile(48)).toBe(3);
});

test('converts FEN string to an array', () => {
  const xb = new XiangqiBoard();
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
  const actual = xb.fromFen(fen);
  expect(actual).toStrictEqual(expected);
});

test('converts FEN string to an board and back', () => {
  const fen = 'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR';
  const xb = new XiangqiBoard({ fen });
  expect(xb.toFen()).toBe(fen);
});

test('moves a piece and returns the new board with the new position', () => {
  const fen = 'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR';
  const xb = new XiangqiBoard({ fen });

  const actual = xb.move(0, 9).toFen();
  const expected = '1heakaehr/r8/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR';
  expect(actual).toBe(expected);

  // original board should be unchanged
  expect(xb.toFen()).toBe(fen);
});

function sameElements(actual, expected) {
  expect(actual).toEqual(expect.arrayContaining(expected));
  expect(expected).toEqual(expect.arrayContaining(actual));
}

const toExpected = (xb, moves) => moves.reduce(
  (acc, { from, to }) => {
    acc[xb.getSlot(...from)] = to.map((pos) => xb.getSlot(...pos));
    return acc;
  },
  {},
);

const legalMoveTests = [
  [
    '3k5/9/9/9/pp7/1p7/9/9/9/4K4',
    [
      // king moves
      { from: [0, 3], to: [[1, 3]] },
      { from: [9, 4], to: [[9, 5], [8, 4]] },
      // pawn moves
      { from: [4, 0], to: [[5, 0]] },
      { from: [4, 1], to: [] },
      { from: [5, 1], to: [[6, 1], [5, 2], [5, 0]] },
    ],
  ],
  // Initial board layout
  [
    'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR',
    [
      // king moves
      { from: [0, 4], to: [[1, 4]] },
      { from: [9, 4], to: [[8, 4]] },
      // advisor moves
      { from: [0, 3], to: [[1, 4]] },
      { from: [0, 5], to: [[1, 4]] },
      { from: [9, 3], to: [[8, 4]] },
      { from: [9, 5], to: [[8, 4]] },
      // pawn moves
      { from: [3, 0], to: [[4, 0]] },
      { from: [3, 2], to: [[4, 2]] },
      { from: [3, 4], to: [[4, 4]] },
      { from: [3, 6], to: [[4, 6]] },
      { from: [3, 8], to: [[4, 8]] },
      { from: [6, 0], to: [[5, 0]] },
      { from: [6, 2], to: [[5, 2]] },
      { from: [6, 4], to: [[5, 4]] },
      { from: [6, 6], to: [[5, 6]] },
      { from: [6, 8], to: [[5, 8]] },
      // horse moves
      { from: [0, 1], to: [[2, 0], [2, 2]] },
      { from: [0, 7], to: [[2, 6], [2, 8]] },
      { from: [9, 1], to: [[7, 0], [7, 2]] },
      { from: [9, 7], to: [[7, 6], [7, 8]] },
      // elephant moves
      { from: [0, 2], to: [[2, 0], [2, 4]] },
      { from: [0, 6], to: [[2, 4], [2, 8]] },
      { from: [9, 2], to: [[7, 0], [7, 4]] },
      { from: [9, 6], to: [[7, 4], [7, 8]] },
      // rook moves
      { from: [0, 0], to: [[1, 0], [2, 0]] },
      { from: [0, 8], to: [[1, 8], [2, 8]] },
      { from: [9, 0], to: [[8, 0], [7, 0]] },
      { from: [9, 8], to: [[8, 8], [7, 8]] },
      // cannon moves
      {
        from: [2, 1],
        to: [
          [2, 0], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6],
          [1, 1], [3, 1], [4, 1], [5, 1], [6, 1], [9, 1],
        ],
      },
      {
        from: [2, 7],
        to: [
          [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 8],
          [1, 7], [3, 7], [4, 7], [5, 7], [6, 7], [9, 7],
        ],
      },
      {
        from: [7, 1],
        to: [
          [7, 0], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6],
          [8, 1], [6, 1], [5, 1], [4, 1], [3, 1], [0, 1],
        ],
      },
      {
        from: [7, 7],
        to: [
          [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 8],
          [8, 7], [6, 7], [5, 7], [4, 7], [3, 7], [0, 7],
        ],
      },
    ],
  ],
  // Bugfix: Pawn going across board
  [
    '9/9/9/9/9/9/9/9/8p/9',
    [
      { from: [8, 8], to: [[9, 8], [8, 7]] },
    ],
  ],
  // Bugfix: Missing horse positions
  [
    'rheakaehr/9/1c5c1/p1p1p1p1p/9/2P6/P3P1P1P/1CH4C1/9/R1EAKAEHR',
    [
      // king moves
      { from: [0, 4], to: [[1, 4]] },
      { from: [9, 4], to: [[8, 4]] },
      // advisor moves
      { from: [0, 3], to: [[1, 4]] },
      { from: [0, 5], to: [[1, 4]] },
      { from: [9, 3], to: [[8, 4]] },
      { from: [9, 5], to: [[8, 4]] },
      // pawn moves
      { from: [3, 0], to: [[4, 0]] },
      { from: [3, 2], to: [[4, 2]] },
      { from: [3, 4], to: [[4, 4]] },
      { from: [3, 6], to: [[4, 6]] },
      { from: [3, 8], to: [[4, 8]] },
      { from: [6, 0], to: [[5, 0]] },
      { from: [5, 2], to: [[4, 2]] },
      { from: [6, 4], to: [[5, 4]] },
      { from: [6, 6], to: [[5, 6]] },
      { from: [6, 8], to: [[5, 8]] },
      // horse moves
      { from: [0, 1], to: [[2, 0], [2, 2]] },
      { from: [0, 7], to: [[2, 6], [2, 8]] },
      { from: [7, 2], to: [[9, 1], [8, 4], [5, 1], [5, 3]] },
      { from: [9, 7], to: [[7, 6], [7, 8]] },
      // elephant moves
      { from: [0, 2], to: [[2, 0], [2, 4]] },
      { from: [0, 6], to: [[2, 4], [2, 8]] },
      { from: [9, 2], to: [[7, 0], [7, 4]] },
      { from: [9, 6], to: [[7, 4], [7, 8]] },
      // rook moves
      { from: [0, 0], to: [[1, 0], [2, 0]] },
      { from: [0, 8], to: [[1, 8], [2, 8]] },
      { from: [9, 0], to: [[8, 0], [7, 0], [9, 1]] },
      { from: [9, 8], to: [[8, 8], [7, 8]] },
      // cannon moves
      {
        from: [2, 1],
        to: [
          [2, 0], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6],
          [1, 1], [3, 1], [4, 1], [5, 1], [6, 1],
        ],
      },
      {
        from: [2, 7],
        to: [
          [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 8],
          [1, 7], [3, 7], [4, 7], [5, 7], [6, 7], [9, 7],
        ],
      },
      {
        from: [7, 1],
        to: [
          [7, 0],
          [9, 1], [8, 1], [6, 1], [5, 1], [4, 1], [3, 1], [0, 1],
        ],
      },
      {
        from: [7, 7],
        to: [
          [7, 3], [7, 4], [7, 5], [7, 6], [7, 8],
          [8, 7], [6, 7], [5, 7], [4, 7], [3, 7], [0, 7],
        ],
      },
    ],
  ],
  // Bugfix: Horse jumps around board
  [
    '9/9/9/9/9/9/P8/HC7/9/9',
    [ // pawn moves
      { from: [6, 0], to: [[5, 0]] },
      // horse moves
      { from: [7, 0], to: [[9, 1]] },
      // cannon moves
      {
        from: [7, 1],
        to: [
          [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8],
          [9, 1], [8, 1], [6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [0, 1],
        ],
      },
    ],
  ],
  // Blocked elephant
  [
    '9/9/9/9/9/2E6/1P1p5/E8/9/9',
    [
      // pawn moves
      { from: [6, 1], to: [[5, 1]] },
      { from: [6, 3], to: [[7, 3], [6, 2], [6, 4]] },
      // elephant moves
      { from: [7, 0], to: [[9, 2]] },
    ],
  ],
  // King in check
  [
    'rheakaehr/4P4/1c5c1/p1p1p1p1p/9/9/9/9/9/9',
    [
      // king moves
      { from: [0, 4], to: [[1, 4]] },
      // advisor moves
      { from: [0, 3], to: [[1, 4]] },
      { from: [0, 5], to: [[1, 4]] },
      // pawn moves
      { from: [1, 4], to: [[0, 4], [1, 3], [1, 5]] },
    ],
  ],
];

test.each(legalMoveTests)('finds all legal moves for %s', (fen, moves) => {
  const xb = new XiangqiBoard({ fen });
  const actual = xb.legalMoves();
  const expected = toExpected(xb, moves);
  for (let i = 0; i < 90; i++) {
    if (Object.hasOwnProperty.call(expected, i)) {
      sameElements(actual[i], expected[i]);
    } else {
      sameElements(actual[i], []);
    }
  }
});
