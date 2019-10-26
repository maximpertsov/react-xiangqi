import { Piece, FILE_COUNT } from './constants';

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
