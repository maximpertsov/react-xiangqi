import {
  Piece,
  RANK_COUNT,
  FILE_COUNT,
  BLACK_PIECES,
  RED_PIECES,
  BLACK_PALACE,
  RED_PALACE,
  ORTHOGONAL_MOVES,
  DIAGONAL_MOVES,
} from './constants';

// Pieces
export const isPawn = piece =>
  piece === Piece.Black.PAWN || piece === Piece.Red.PAWN;
export const isChariot = piece =>
  piece === Piece.Black.CHARIOT || piece === Piece.Red.CHARIOT;
export const isHorse = piece =>
  piece === Piece.Black.HORSE || piece === Piece.Red.HORSE;
export const isElephant = piece =>
  piece === Piece.Black.ELEPHANT || piece === Piece.Red.ELEPHANT;
export const isGeneral = piece =>
  piece === Piece.Black.GENERAL || piece === Piece.Red.GENERAL;
export const isCannon = piece =>
  piece === Piece.Black.CANNON || piece === Piece.Red.CANNON;
export const isAdvisor = piece =>
  piece === Piece.Black.ADVISOR || piece === Piece.Red.ADVISOR;

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

// Palace
export const inBlackPalace = slot =>
  BLACK_PALACE.map(pos => getSlot(...pos)).includes(slot);
export const inRedPalace = slot =>
  RED_PALACE.map(pos => getSlot(...pos)).includes(slot);

// Move
export const tryMove = (slot, rankMove, fileMove) => {
  const [rank, file] = getRankFile(slot);
  const newRank = rankMove + rank;
  const newFile = fileMove + file;
  if (newRank < 0 || newRank >= RANK_COUNT) return null;
  if (newFile < 0 || newFile >= FILE_COUNT) return null;
  return getSlot(newRank, newFile);
};

// TODO: make this non-recursive?
export const tryMarch = (
  slot,
  rankMove,
  fileMove,
  steps = Math.max(RANK_COUNT, FILE_COUNT),
) => {
  if (steps < 1) return [];
  const nextSlot = tryMove(slot, rankMove, fileMove);
  if (nextSlot === null) return [];
  const restSlots = tryMarch(nextSlot, rankMove, fileMove, steps - 1);
  restSlots.push(nextSlot);
  return restSlots;
};

export const tryMarchMoves = (slot, moves, steps) =>
  moves.reduce(
    (acc, move) => acc.concat(tryMarch(slot, move[0], move[1], steps)),
    [],
  );

export const orthogonalSlots = (slot, radius) => {
  const steps = radius === undefined ? 1 : radius;
  return tryMarchMoves(slot, ORTHOGONAL_MOVES, steps);
};

export const diagonalSlots = (slot, radius) => {
  const steps = radius === undefined ? 1 : radius;
  return tryMarchMoves(slot, DIAGONAL_MOVES, steps);
};
