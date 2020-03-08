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
export const ALL_PIECES = BLACK_PIECES.concat(RED_PIECES);
export const RANK_COUNT = 10;
export const FILE_COUNT = 9;
