const RANKS = 10;
const FILES = 9;
const BLACK_PIECES = 'rheakcp';
const RED_PIECES = 'RHEAKCP';
const BLACK_RIVER_BANK = 4;
const RED_RIVER_BANK = 5;
const ORTHOGONAL_MOVES = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const DIAGONAL_MOVES = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
const EMPTY_BOARD_FEN = '9/9/9/9/9/9/9/9/9/9';

class XiangqiBoard {
  constructor({
    ranks = RANKS,
    files = FILES,
    redPieces = RED_PIECES,
    blackPieces = BLACK_PIECES,
    fen = EMPTY_BOARD_FEN,
  }) {
    this.ranks = ranks;
    this.files = files;
    this.redPieces = redPieces;
    this.blackPieces = blackPieces;
    this.board = this.constructor.fromFen(fen);
  }

  getSlot(rank, file) { return file + rank * this.files; }

  getRank(slot) { return Math.floor(slot / this.files); }

  getFile(slot) { return slot % this.files; }

  getRankFile(slot) { return [this.getRank(slot), this.getFile(slot)]; }

  isRed(code) { return this.redPieces.includes(code); }

  isBlack(code) { return this.blackPieces.includes(code); }

  sameColor(code1, code2) {
    return (this.isRed(code1) && this.isRed(code2))
      || (this.isBlack(code1) && this.isBlack(code2));
  }

  static fromFenRow(row) {
    return row.split('').reduce((acc, ch) => {
      const val = +ch;
      const newItems = Number.isNaN(val) ? [ch] : Array(val).fill(null);
      return acc.concat(newItems);
    }, []);
  }

  static fromFen(fen) {
    return fen.split('/').reduce(
      (acc, row) => acc.concat(this.constructor.fromFenRow(row)),
      [],
    );
  }

// function getNextRankSlot(board, slot) {
//   const code = board[slot];
//   const rank = getRank(slot);
//   const file = getFile(slot);
//   let nextRank = rank;
//   if (isBlack(code)) nextRank = Math.min(rank + 1, RANKS - 1);
//   if (isRed(code)) nextRank = Math.max(rank - 1, 0);
//   return getSlot(nextRank, file);
// }
//
// function crossingRiver(board, fromSlot, toSlot) {
//   const code = board[fromSlot];
//   const rank = getRank(toSlot);
//   if (isBlack(code)) return rank >= RED_RIVER_BANK;
//   if (isRed(code)) return rank <= BLACK_RIVER_BANK;
//   return false;
// }
//
// function isUniverallyLegal(board, fromSlot, toSlot) {
//   if (toSlot === null) return false;
//   if (fromSlot === toSlot) return false;
//   if (sameColor(board[fromSlot], board[toSlot])) return false;
//   return true;
// }
//
// function addIfUniversallyLegal(moves, board, fromSlot, toSlot) {
//   if (isUniverallyLegal(board, fromSlot, toSlot)) {
//     moves.push(toSlot);
//   }
// }
//
// function tryMove(slot, rankMove, fileMove) {
//   const [rank, file] = getRankFile(slot);
//   const newRank = rankMove + rank;
//   const newFile = fileMove + file;
//   if (newRank < 0 || newRank >= RANKS) return null;
//   if (newFile < 0 || newFile >= FILES) return null;
//   return getSlot(newRank, newFile);
// }
//
// function tryMoves(slot, moves) {
//   return moves.map((m) => tryMove(slot, m[0], m[1]));
// }
//
// // TODO make this non-recursive?
// function tryMarch(slot, rankMove, fileMove, steps) {
//   if (steps < 1) return [];
//   const nextSlot = tryMove(slot, rankMove, fileMove);
//   if (nextSlot === null) return [];
//   return [nextSlot].concat(tryMarch(nextSlot, rankMove, fileMove, steps - 1));
// }
//
// function tryMarchMoves(slot, moves, steps) {
//   return moves.reduce(
//     (acc, move) => acc.concat(tryMarch(slot, move[0], move[1], steps)),
//     [],
//   );
// }
//
// function legalPawnMoves(board, slot) {
//   const result = [];
//   const forwardSlot = getNextRankSlot(board, slot);
//   addIfUniversallyLegal(result, board, slot, forwardSlot);
//   if (crossingRiver(board, slot, slot)) {
//     addIfUniversallyLegal(result, board, slot, tryMove(slot, 0, -1));
//     addIfUniversallyLegal(result, board, slot, tryMove(slot, 0, 1));
//   }
//   return result;
// }
//
// function orthogonalSlots(slot, radius) {
//   const steps = radius === undefined ? 1 : radius;
//   return tryMarchMoves(slot, ORTHOGONAL_MOVES, steps);
// }
//
// function diagonalSlots(slot, radius) {
//   const steps = radius === undefined ? 1 : radius;
//   return tryMarchMoves(slot, DIAGONAL_MOVES, steps);
// }
//
// function isOccupied(board, slot) {
//   return board[slot] !== null;
// }
//
// function legalHorseMoves(board, slot) {
//   const result = [];
//
//   orthogonalSlots(slot).forEach((firstHop, _, firstHops) => {
//     if (isOccupied(board, firstHop)) return;
//
//     diagonalSlots(firstHop).forEach((secondHop) => {
//       if (firstHops.includes(secondHop) || result.includes(secondHop)) return;
//       addIfUniversallyLegal(result, board, slot, secondHop);
//     });
//   });
//
//   return result;
// }
//
// // TODO stub
// function legalRookMoves(board, slot) {
//   return orthogonalSlots(slot, 10);
// }
//
// // TODO stub
// function legalCannonMoves(board, slot) {
//   return orthogonalSlots(slot, 10);
// }
//
// function legalElephantMoves(board, slot) {
//   const result = [];
//   DIAGONAL_MOVES.forEach((move) => {
//     const firstHop = tryMove(slot, ...move);
//     if (isOccupied(board, firstHop) || crossingRiver(board, slot, firstHop)) {
//       return;
//     }
//
//     const secondHop = tryMove(firstHop, ...move);
//     addIfUniversallyLegal(result, board, slot, secondHop);
//   });
//   return result;
// }
//
// // TODO stub
// function legalAdvisorMoves(board, slot) {
//   return diagonalSlots(slot, 1);
// }
//
// // TODO stub
// function legalKingMoves(board, slot) {
//   return orthogonalSlots(slot, 1);
// }
//
// export function legalMoves(board) {
//   return board.map((code, slot, b) => {
//     if (code === 'p' || code === 'P') return legalPawnMoves(b, slot);
//     if (code === 'h' || code === 'H') return legalHorseMoves(b, slot);
//     // // TODO untested
//     // if (code === 'r' || code === 'R') return legalRookMoves(b, slot);
//     // // TODO untested
//     // if (code === 'c' || code === 'C') return legalCannonMoves(b, slot);
//     // TODO untested
//     if (code === 'e' || code === 'E') return legalElephantMoves(b, slot);
//     // // TODO untested
//     // if (code === 'a' || code === 'A') return legalAdvisorMoves(b, slot);
//     // // TODO untested
//     // if (code === 'k' || code === 'K') return legalKingMoves(b, slot);
//     return [];
//   });
// }
}

export default XiangqiBoard;
