export const RefType = Object.freeze({
  SLOT: 0,
  RANK_FILE: 1,
  RANK_FILE_STRING: 2,
});

export const Color = Object.freeze({
  RED: 'red',
  BLACK: 'black',
});

export const Piece = Object.freeze({
  Black: Object.freeze({
    CHARIOT: 'r',
    HORSE: 'h',
    ELEPHANT: 'e',
    ADVISOR: 'a',
    GENERAL: 'k',
    CANNON: 'c',
    PAWN: 'p',
  }),
  Red: Object.freeze({
    CHARIOT: 'R',
    HORSE: 'H',
    ELEPHANT: 'E',
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
