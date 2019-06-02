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

function isUniverallyLegal(board, fromSlot, toSlot) {
  if (toSlot === null) return false;
  if (fromSlot === toSlot) return false;
  if (sameColor(board[fromSlot], board[toSlot])) return false;
  return true;
}

function addIfUniversallyLegal(moves, board, fromSlot, toSlot) {
  if (isUniverallyLegal(board, fromSlot, toSlot)) {
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

function tryMoves(slot, moves) {
  return moves.map((m) => tryMove(slot, m[0], m[1]));
}

// TODO make this non-recursive?
function tryMarch(slot, rankMove, fileMove, steps) {
  if (steps < 1) return [];
  const nextSlot = tryMove(slot, rankMove, fileMove);
  if (nextSlot === null) return [];
  return [nextSlot].concat(tryMarch(nextSlot, rankMove, fileMove, steps - 1));
}

function tryMarchMoves(slot, moves, steps) {
  return moves.reduce(
    (acc, move) => acc.concat(tryMarch(slot, move[0], move[1], steps)),
    [],
  );
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

function orthogonalMoves(slot, radius) {
  const steps = radius === undefined ? 1 : radius;
  return tryMarchMoves(slot, [[1, 0], [-1, 0], [0, 1], [0, -1]], steps);
}

function diagonalMoves(slot, radius) {
  const steps = radius === undefined ? 1 : radius;
  return tryMarchMoves(slot, [[1, 1], [-1, 1], [1, -1], [-1, -1]], steps);
}

function isOccupied(board, slot) {
  return board[slot] !== null;
}

function legalHorseMoves(board, slot) {
  const result = [];

  orthogonalMoves(slot).forEach((firstHop, _, firstHops) => {
    if (isOccupied(board, firstHop)) return;

    diagonalMoves(firstHop).forEach((secondHop) => {
      if (firstHops.includes(secondHop) || result.includes(secondHop)) return;
      addIfUniversallyLegal(result, board, slot, secondHop);
    });
  });

  return result;
}

// TODO stub
function legalRookMoves(board, slot) {
  return orthogonalMoves(slot, 10);
}

// TODO stub
function legalCannonMoves(board, slot) {
  return orthogonalMoves(slot, 10);
}

// TODO stub
function legalElephantMoves(board, slot) {
  return diagonalMoves(slot, 2);
}

// TODO stub
function legalAdvisorMoves(board, slot) {
  return diagonalMoves(slot, 1);
}

// TODO stub
function legalKingMoves(board, slot) {
  return orthogonalMoves(slot, 1);
}

export function legalMoves(board) {
  return board.map((code, slot, b) => {
    if (code === 'p' || code === 'P') return legalPawnMoves(b, slot);
    if (code === 'h' || code === 'H') return legalHorseMoves(b, slot);
    // // TODO untested
    // if (code === 'r' || code === 'R') return legalRookMoves(b, slot);
    // // TODO untested
    // if (code === 'c' || code === 'C') return legalCannonMoves(b, slot);
    // TODO untested
    if (code === 'e' || code === 'E') return legalElephantMoves(b, slot);
    // // TODO untested
    // if (code === 'a' || code === 'A') return legalAdvisorMoves(b, slot);
    // // TODO untested
    // if (code === 'k' || code === 'K') return legalKingMoves(b, slot);
    return [];
  });
}

export default {};
