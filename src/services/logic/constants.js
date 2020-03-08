export const Color = Object.freeze({
  RED: 'red',
  BLACK: 'black',
});

export const Piece = Object.freeze({
  Black: Object.freeze({
    CHARIOT: 'r',
    HORSE: 'n',
    ELEPHANT: 'b',
    ADVISOR: 'a',
    GENERAL: 'k',
    CANNON: 'c',
    PAWN: 'p',
  }),
  Red: Object.freeze({
    CHARIOT: 'R',
    HORSE: 'N',
    ELEPHANT: 'B',
    ADVISOR: 'A',
    GENERAL: 'K',
    CANNON: 'C',
    PAWN: 'P',
  }),
});

export const BLACK_PIECES = Object.values(Piece.Black);
export const RED_PIECES = Object.values(Piece.Red);
export const RANK_COUNT = 10;
export const FILE_COUNT = 9;
export const BLACK_RIVER_BANK = 4;
export const RED_RIVER_BANK = 5;
export const ORTHOGONAL_MOVES = [[1, 0], [-1, 0], [0, 1], [0, -1]];
export const DIAGONAL_MOVES = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
export const BLACK_PALACE = [
  [0, 3], [0, 4], [0, 5],
  [1, 3], [1, 4], [1, 5],
  [2, 3], [2, 4], [2, 5],
];
export const RED_PALACE = [
  [9, 3], [9, 4], [9, 5],
  [8, 3], [8, 4], [8, 5],
  [7, 3], [7, 4], [7, 5],
];
