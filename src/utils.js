const RANKS = 10;
const FILES = 9;
const BLACK_PIECES = 'rheakcp';
const RED_PIECES = 'RHEAKCP';
const BLACK_RIVER_BANK = 4;
const RED_RIVER_BANK = 5;

export const getSlot = (rank, file) => file + rank * FILES;
export const getRank = (idx) => Math.floor(idx / FILES);
export const getFile = (idx) => idx % FILES;
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

function getNextRank(board, idx) {
  const code = board[idx];
  const rank = getRank(idx);
  if (isBlack(code)) return Math.min(rank + 1, RANKS - 1);
  if (isRed(code)) return Math.max(rank - 1, 0);
  return rank;
}

function isBeyondRiver(board, idx) {
  const code = board[idx];
  const rank = getRank(idx);
  if (isBlack(code)) return rank >= RED_RIVER_BANK;
  if (isRed(code)) return rank <= BLACK_RIVER_BANK;
  return false;
}

function isUniverallyLegal(board, fromIdx, toIdx) {
  if (fromIdx === toIdx) return false;
  // TODO Check if rank and file in bounds, not just slots
  if (toIdx < 0) return false;
  if (toIdx >= RANKS * FILES) return false;
  if (sameColor(board[fromIdx], board[toIdx])) return false;
  return true;
}

function addIfUniversallyLegal(moves, board, fromIdx, toIdx) {
  if (isUniverallyLegal(board, fromIdx, toIdx)) moves.push(toIdx);
}

function legalPawnMoves(board, idx) {
  const result = [];
  const rank = getRank(idx);
  const file = getFile(idx);
  const nextRank = getNextRank(board, idx);
  addIfUniversallyLegal(result, board, idx, getSlot(nextRank, file));
  if (isBeyondRiver(board, idx)) {
    addIfUniversallyLegal(result, board, idx, getSlot(rank, file - 1));
    addIfUniversallyLegal(result, board, idx, getSlot(rank, file + 1));
  }
  return result;
}


export function legalMoves(board) {
  return board.map((code, idx, b) => {
    if (code === 'p' || code === 'P') return legalPawnMoves(b, idx);
    return [];
  });
}

export default {};
