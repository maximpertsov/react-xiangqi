const RANKS = 10;
const FILES = 9;
const BLACK_PIECES = 'rheakcp';
const RED_PIECES = 'RHEAKCP';
const BLACK_RIVER_BANK = 4;
const RED_RIVER_BANK = 5;

export const getSlot = (rank, file) => file + rank * FILES;
export const getRank = (slot) => Math.floor(slot / FILES);
export const getFile = (slot) => slot % FILES;
const getRankFile = (slot) => [getRank(slot), getFile(slot)];
const isRed = (code) => RED_PIECES.includes(code);
const isBlack = (code) => BLACK_PIECES.includes(code);
function sameColor(code1, code2) {
  return (isRed(code1) && isRed(code2)) || (isBlack(code1) && isBlack(code2));
}

function fromFenRow(row) {
  return row.split('').reduce((acc, ch) => {
    const val = +ch;
    const newItems = Number.isNaN(val) ? [ch] : Array(val).fill(null);
    return acc.concat(newItems);
  }, []);
}

export function fromFen(fen) {
  return fen.split('/').reduce((acc, row) => acc.concat(fromFenRow(row)), []);
}

function getNextRankSlot(board, slot) {
  const code = board[slot];
  const rank = getRank(slot);
  const file = getFile(slot);
  let nextRank = rank;
  if (isBlack(code)) nextRank = Math.min(rank + 1, RANKS - 1);
  if (isRed(code)) nextRank = Math.max(rank - 1, 0);
  return getSlot(nextRank, file);
}

function isBeyondRiver(board, slot) {
  const code = board[slot];
  const rank = getRank(slot);
  if (isBlack(code)) return rank >= RED_RIVER_BANK;
  if (isRed(code)) return rank <= BLACK_RIVER_BANK;
  return false;
}

function isUniverallyLegal(board, fromIdx, toSlot) {
  if (toSlot === null) return false;
  if (fromIdx === toSlot) return false;
  const [toRank, toFile] = getRankFile(toSlot);
  if (toRank < 0) return false;
  if (toRank >= RANKS) return false;
  if (toFile < 0) return false;
  if (toFile >= FILES) return false;
  if (sameColor(board[fromIdx], board[toSlot])) return false;
  return true;
}

function addIfUniversallyLegal(moves, board, fromIdx, toSlot) {
  if (isUniverallyLegal(board, fromIdx, toSlot)) {
    moves.push(toSlot);
  }
}

function tryMove(slot, rankMove, fileMove) {
  const [rank, file] = getRankFile(slot);
  const newRank = rankMove + rank;
  const newFile = fileMove + file;
  if (newRank < 0 || newRank >= RANKS) return null;
  if (newFile < 0 || newFile >= FILES) return null;
  return getSlot(newRank, newFile);
}

function relativeSquares(board, slot, moves) {
  const rank = getRank(slot);
  const file = getFile(slot);
  return moves.map((m) => getSlot(m[0] + rank, m[1] + file));
}

function legalPawnMoves(board, slot) {
  const result = [];
  const forwardSlot = getNextRankSlot(board, slot);
  addIfUniversallyLegal(result, board, slot, forwardSlot);
  if (isBeyondRiver(board, slot)) {
    addIfUniversallyLegal(result, board, slot, tryMove(slot, 0, -1));
    addIfUniversallyLegal(result, board, slot, tryMove(slot, 0, 1));
  }
  return result;
}

function orthogonalSquares(board, slot) {
  return relativeSquares(board, slot, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
}

function diagonalSquares(board, slot) {
  return relativeSquares(board, slot, [[1, 1], [-1, 1], [1, -1], [-1, -1]]);
}

function isOccupied(board, slot) {
  return board[slot] !== null;
}

function legalHorseMoves(board, slot) {
  const result = [];

  orthogonalSquares(board, slot).forEach((firstHop, _, firstHops) => {
    if (isOccupied(board, firstHop)) return;

    diagonalSquares(board, firstHop).forEach((secondHop) => {
      if (firstHops.includes(secondHop) || result.includes(secondHop)) return;
      addIfUniversallyLegal(result, board, slot, secondHop);
    });
  });

  return result;
}

export function legalMoves(board) {
  return board.map((code, slot, b) => {
    if (code === 'p' || code === 'P') return legalPawnMoves(b, slot);
    if (code === 'h' || code === 'H') return legalHorseMoves(b, slot);
    return [];
  });
}

export default {};
