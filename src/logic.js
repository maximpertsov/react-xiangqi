import update from 'immutability-helper';

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
    redRiverBank = RED_RIVER_BANK,
    blackRiverBank = BLACK_RIVER_BANK,
  } = {}) {
    this.ranks = ranks;
    this.files = files;
    this.redPieces = redPieces;
    this.blackPieces = blackPieces;
    this.redRiverBank = redRiverBank;
    this.blackRiverBank = blackRiverBank;
    this.board = this.fromFen(fen);
  }

  move(fromSlot, toSlot) {
    const options = { ...this };
    const board = update(update(options.board, {
      [toSlot]: { $set: options.board[fromSlot] },
    }), {
      [fromSlot]: { $set: null },
    });
    delete options.board;
    options.fen = this.toFen(board);
    return new this.constructor(options);
  }

  getPiece(rank, file) { return this.board[this.getSlot(rank, file)]; }

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

  // TODO consolidate with sameColor method
  sameColorSlot(slot1, slot2) {
    const code1 = this.board[slot1];
    const code2 = this.board[slot2];
    return this.sameColor(code1, code2);
  }

  static fromFenRow(row) {
    return row.split('').reduce((acc, ch) => {
      const val = +ch;
      const newItems = Number.isNaN(val) ? [ch] : Array(val).fill(null);
      return acc.concat(newItems);
    }, []);
  }

  fromFen(fen) {
    return fen.split('/').reduce(
      (acc, row) => acc.concat(this.constructor.fromFenRow(row)),
      [],
    );
  }

  getNextRankSlot(slot) {
    const code = this.board[slot];
    const rank = this.getRank(slot);
    const file = this.getFile(slot);
    let nextRank = rank;
    if (this.isBlack(code)) nextRank = Math.min(rank + 1, this.ranks - 1);
    if (this.isRed(code)) nextRank = Math.max(rank - 1, 0);
    return this.getSlot(nextRank, file);
  }

  crossingRiver(fromSlot, toSlot) {
    const code = this.board[fromSlot];
    const rank = this.getRank(toSlot);
    if (this.isBlack(code)) return rank >= this.redRiverBank;
    if (this.isRed(code)) return rank <= this.blackRiverBank;
    return false;
  }

  isUniverallyLegal(fromSlot, toSlot) {
    if (toSlot === null) return false;
    if (fromSlot === toSlot) return false;
    if (this.sameColor(this.board[fromSlot], this.board[toSlot])) return false;
    return true;
  }

  addIfUniversallyLegal(moves, fromSlot, toSlot) {
    if (this.isUniverallyLegal(fromSlot, toSlot)) {
      moves.push(toSlot);
    }
  }

  tryMove(slot, rankMove, fileMove) {
    const [rank, file] = this.getRankFile(slot);
    const newRank = rankMove + rank;
    const newFile = fileMove + file;
    if (newRank < 0 || newRank >= this.ranks) return null;
    if (newFile < 0 || newFile >= this.files) return null;
    return this.getSlot(newRank, newFile);
  }

  tryMoves(slot, moves) {
    return moves.map((m) => this.tryMove(slot, ...m));
  }

  // TODO make this non-recursive?
  tryMarch(slot, rankMove, fileMove, steps = Math.max(this.ranks, this.files)) {
    if (steps < 1) return [];
    const nextSlot = this.tryMove(slot, rankMove, fileMove);
    if (nextSlot === null) return [];
    const restSlots = this.tryMarch(nextSlot, rankMove, fileMove, steps - 1);
    restSlots.push(nextSlot);
    return restSlots;
  }

  tryMarchMoves(slot, moves, steps) {
    return moves.reduce(
      (acc, move) => acc.concat(this.tryMarch(slot, move[0], move[1], steps)),
      [],
    );
  }

  legalPawnMoves(slot) {
    const result = [];
    const forwardSlot = this.getNextRankSlot(slot);
    this.addIfUniversallyLegal(result, slot, forwardSlot);
    if (this.crossingRiver(slot, slot)) {
      this.addIfUniversallyLegal(result, slot, this.tryMove(slot, 0, -1));
      this.addIfUniversallyLegal(result, slot, this.tryMove(slot, 0, 1));
    }
    return result;
  }

  orthogonalSlots(slot, radius) {
    const steps = radius === undefined ? 1 : radius;
    return this.tryMarchMoves(slot, ORTHOGONAL_MOVES, steps);
  }

  diagonalSlots(slot, radius) {
    const steps = radius === undefined ? 1 : radius;
    return this.tryMarchMoves(slot, DIAGONAL_MOVES, steps);
  }

  isOccupied(slot) {
    return this.board[slot] !== null;
  }

  legalHorseMoves(slot) {
    const result = [];

    this.orthogonalSlots(slot).forEach((firstHop, _, firstHops) => {
      if (this.isOccupied(firstHop)) return;

      this.diagonalSlots(firstHop).forEach((secondHop) => {
        if (firstHops.includes(secondHop) || result.includes(secondHop)) return;
        this.addIfUniversallyLegal(result, slot, secondHop);
      });
    });

    return result;
  }

  legalRookMoves(slot) {
    const result = [];
    ORTHOGONAL_MOVES.forEach((move) => {
      let toSlot = slot;
      while (true) {
        toSlot = this.tryMove(toSlot, ...move);
        if (toSlot === null) break;
        this.addIfUniversallyLegal(result, slot, toSlot);
        if (this.isOccupied(toSlot)) break;
      }
    });
    return result;
  }

  // TODO stub
  legalCannonMoves(board, slot) {
    return this.orthogonalSlots(slot, 10);
  }

  legalElephantMoves(slot) {
    const result = [];
    DIAGONAL_MOVES.forEach((move) => {
      const firstHop = this.tryMove(slot, ...move);
      if (this.isOccupied(firstHop) || this.crossingRiver(slot, firstHop)) {
        return;
      }

      const secondHop = this.tryMove(firstHop, ...move);
      this.addIfUniversallyLegal(result, slot, secondHop);
    });
    return result;
  }

  // TODO stub
  legalAdvisorMoves(slot) {
    return this.diagonalSlots(slot, 1);
  }

  // TODO stub
  legalKingMoves(slot) {
    return this.orthogonalSlots(slot, 1);
  }

  legalMoves() {
    return this.board.map((code, slot) => {
      if (code === 'p' || code === 'P') return this.legalPawnMoves(slot);
      if (code === 'h' || code === 'H') return this.legalHorseMoves(slot);
      if (code === 'r' || code === 'R') return this.legalRookMoves(slot);
      // // TODO untested
      // if (code === 'c' || code === 'C') return this.legalCannonMoves(slot);
      if (code === 'e' || code === 'E') return this.legalElephantMoves(slot);
      // // TODO untested
      // if (code === 'a' || code === 'A') return this.legalAdvisorMoves(slot);
      // // TODO untested
      // if (code === 'k' || code === 'K') return this.legalKingMoves(slot);
      return [];
    });
  }

  toFen(board = this.board) {
    const rows = [];
    board.forEach((piece, idx) => {
      if (idx % this.files === 0) rows.push([]);
      const lastRow = rows[rows.length - 1];
      const lastRowSize = lastRow.length;
      if (piece !== null) {
        lastRow.push(piece);
      } else if (lastRowSize === 0 || Number.isNaN(+lastRow[lastRowSize - 1])) {
        lastRow.push(1);
      } else {
        lastRow[lastRowSize - 1]++;
      }
    });
    return rows.map((row) => row.join('')).join('/');
  }
}

export default XiangqiBoard;
