import {
  Piece,
  FILE_COUNT,
  BLACK_PIECES,
  RED_PIECES,
  BLACK_PALACE,
  RED_PALACE,
} from './constants';

export const isPawn = (piece) => (
  piece === Piece.Black.PAWN || piece === Piece.Red.PAWN
);
export const isChariot = (piece) => (
  piece === Piece.Black.CHARIOT || piece === Piece.Red.CHARIOT
);
export const isHorse = (piece) => (
  piece === Piece.Black.HORSE || piece === Piece.Red.HORSE
);
export const isElephant = (piece) => (
  piece === Piece.Black.ELEPHANT || piece === Piece.Red.ELEPHANT
);
export const isGeneral = (piece) => (
  piece === Piece.Black.GENERAL || piece === Piece.Red.GENERAL
);
export const isCannon = (piece) => (
  piece === Piece.Black.CANNON || piece === Piece.Red.CANNON
);
export const isAdvisor = (piece) => (
  piece === Piece.Black.ADVISOR || piece === Piece.Red.ADVISOR
);

export const getSlot = (rank, file) => file + (rank * FILE_COUNT);
export const getRank = (slot) => Math.floor(slot / FILE_COUNT);
export const getFile = (slot) => slot % FILE_COUNT;
export const getRankFile = (slot) => [getRank(slot), getFile(slot)];

export const isBlack = (piece) => BLACK_PIECES.includes(piece);
export const isRed = (piece) => RED_PIECES.includes(piece);
export const sameColor = (piece1, piece2) => (
  (isRed(piece1) && isRed(piece2)) || (isBlack(piece1) && isBlack(piece2))
);

export const inBlackPalace = (slot) => BLACK_PALACE
  .map((pos) => getSlot(...pos))
  .includes(slot);
export const inRedPalace = (slot) => RED_PALACE
  .map((pos) => getSlot(...pos))
  .includes(slot);
