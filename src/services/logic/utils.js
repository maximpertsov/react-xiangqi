import { FILE_COUNT, BLACK_PIECES, RED_PIECES } from './constants';

// Board square locators
export const getSlot = (rank, file) => file + rank * FILE_COUNT;
export const getRank = slot => Math.floor(slot / FILE_COUNT);
export const getFile = slot => slot % FILE_COUNT;
export const getRankFile = slot => [getRank(slot), getFile(slot)];

// Colors
export const isBlack = piece => BLACK_PIECES.includes(piece);
export const isRed = piece => RED_PIECES.includes(piece);
export const sameColor = (piece1, piece2) =>
  (isRed(piece1) && isRed(piece2)) || (isBlack(piece1) && isBlack(piece2));
