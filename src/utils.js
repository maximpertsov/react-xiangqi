const RANKS = 10;
const FILES = 9;
const RED_PIECES = "RHEAKCP";
const BLACK_PIECES = "rheakcp";

export const getIndex = (rank, file) => file + rank * FILES;
export const getRank = (idx) => Math.ceil(idx / RANKS);
export const getFile = (idx) => idx % FILES;
const isRed = (code) => RED_PIECES.includes(code);
const isBlack = (code) => BLACK_PIECES.includes(code);
function sameColor(code1, code2) {
  return (isRed(code1) && isRed(code2)) || (isBlack(code1) && isBlack(code2))
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

function isUniverallyLegal(moves, board, fromIdx, toIdx) {
  if (fromIdx === toIdx) return false;
  if (toIdx < 0) return false;
  if (toIdx >= RANKS * FILES) return false;
  if (sameColor(board[fromIdx], board[toIdx])) return false;
  return true;
}

export function legalMoves(board) {
}

export default {};
