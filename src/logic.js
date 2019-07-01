import update from 'immutability-helper';
import PropTypes from 'prop-types';

export const RefType = Object.freeze({
  SLOT: 0,
  RANK_FILE: 1,
  RANK_FILE_STRING: 2,
});

const RANKS = 10;
const FILES = 9;
const BLACK_PIECES = 'rheakcp';
const RED_PIECES = 'RHEAKCP';
const BLACK_RIVER_BANK = 4;
const RED_RIVER_BANK = 5;
const ORTHOGONAL_MOVES = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const DIAGONAL_MOVES = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
// TODO store this in a board FEN-style string?
const BLACK_PALACE = [
  [0, 3], [0, 4], [0, 5],
  [1, 3], [1, 4], [1, 5],
  [2, 3], [2, 4], [2, 5],
];
const RED_PALACE = [
  [9, 3], [9, 4], [9, 5],
  [8, 3], [8, 4], [8, 5],
  [7, 3], [7, 4], [7, 5],
];
const EMPTY_BOARD_FEN = '9/9/9/9/9/9/9/9/9/9';

export default class XiangqiBoard {
  // TODO can remove most of this information and parse it from the FEN string
  constructor({
    ranks = RANKS,
    files = FILES,
    redPieces = RED_PIECES,
    blackPieces = BLACK_PIECES,
    fen = EMPTY_BOARD_FEN,
    redRiverBank = RED_RIVER_BANK,
    blackRiverBank = BLACK_RIVER_BANK,
    redPalace = RED_PALACE,
    blackPalace = BLACK_PALACE,
  } = {}) {
    this.ranks = ranks;
    this.files = files;
    this.redPieces = redPieces;
    this.blackPieces = blackPieces;
    this.redRiverBank = redRiverBank;
    this.blackRiverBank = blackRiverBank;
    this.redPalace = redPalace.map((pos) => this.getSlot(...pos));
    this.blackPalace = blackPalace.map((pos) => this.getSlot(...pos));
    this.board = this.fromFen(fen);
  }

  _slot(pos, refType) {
    if (refType === RefType.SLOT) return pos;
    if (refType === RefType.RANK_FILE) {
      const [rank, file] = pos;
      return this.getSlot(rank, file);
    }
    if (refType === RefType.RANK_FILE_STRING) {
      const _pos = pos.split(',').map((x) => +x);
      return this._slot(_pos, RefType.RANK_FILE);
    }
    throw new Error(`Invalid reference type: ${refType}`);
  }

  move(fromPos, toPos, refType = RefType.SLOT) {
    const fromSlot = this._slot(fromPos, refType);
    const toSlot = this._slot(toPos, refType);
    const board = update(update(this.board, {
      [toSlot]: { $set: this.board[fromSlot] },
    }), {
      [fromSlot]: { $set: null },
    });
    return this.new(board);
  }

  drop(piece, pos, refType = RefType.SLOT) {
    const slot = this._slot(pos, refType);
    const board = update(this.board, {
      [slot]: { $set: piece },
    });
    return this.new(board);
  }

  new(board) {
    const options = { ...this };
    delete options.board;
    options.fen = this.toFen(board);
    options.redPalace = this.redPalace.map((slot) => this.getRankFile(slot));
    options.blackPalace = this.blackPalace.map((slot) => this.getRankFile(slot));
    return new this.constructor(options);
  }

  getPiece(pos, refType = RefType.SLOT) {
    const slot = this._slot(pos, refType);
    return this.board[slot];
  }

  getSlot(rank, file) { return file + rank * this.files; }

  getRank(slot) { return Math.floor(slot / this.files); }

  getFile(slot) { return slot % this.files; }

  getRankFile(slot) { return [this.getRank(slot), this.getFile(slot)]; }

  isRedCode(code) { return this.redPieces.includes(code); }

  isRed(slot) {
    const code = this.board[slot];
    return this.isRedCode(code);
  }

  isBlackCode(code) { return this.blackPieces.includes(code); }

  isBlack(slot) {
    const code = this.board[slot];
    return this.isBlackCode(code);
  }

  // TODO refactor and rename?
  isColor(color, slot) {
    const code = this.board[slot];
    if (color === 'red' && this.isRedCode(code)) return true;
    if (color === 'black' && this.isBlackCode(code)) return true;
    return false;
  }

  sameColorCode(code1, code2) {
    return (this.isRedCode(code1) && this.isRedCode(code2))
      || (this.isBlackCode(code1) && this.isBlackCode(code2));
  }

  sameColor(slot1, slot2) {
    const code1 = this.board[slot1];
    const code2 = this.board[slot2];
    return this.sameColorCode(code1, code2);
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
    const rank = this.getRank(slot);
    const file = this.getFile(slot);
    let nextRank = rank;
    if (this.isBlack(slot)) nextRank = Math.min(rank + 1, this.ranks - 1);
    if (this.isRed(slot)) nextRank = Math.max(rank - 1, 0);
    return this.getSlot(nextRank, file);
  }

  crossingRiver(fromSlot, toSlot) {
    const rank = this.getRank(toSlot);
    if (this.isBlack(fromSlot)) return rank >= this.redRiverBank;
    if (this.isRed(fromSlot)) return rank <= this.blackRiverBank;
    return false;
  }

  isUniverallyLegal(fromSlot, toSlot) {
    if (toSlot === null) return false;
    if (fromSlot === toSlot) return false;
    if (this.sameColor(fromSlot, toSlot)) return false;
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

  legalCannonMoves(slot) {
    const result = [];
    ORTHOGONAL_MOVES.forEach((move) => {
      let toSlot = slot;
      let vaulted = false;
      while (true) {
        toSlot = this.tryMove(toSlot, ...move);
        if (toSlot === null) break;
        if (vaulted && this.isOccupied(toSlot)) {
          this.addIfUniversallyLegal(result, slot, toSlot);
          break;
        } else if (this.isOccupied(toSlot)) {
          vaulted = true;
        } else if (!vaulted) {
          this.addIfUniversallyLegal(result, slot, toSlot);
        }
      }
    });
    return result;
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

  inPalace(fromSlot, toSlot) {
    if (this.isBlack(fromSlot)) return this.blackPalace.includes(toSlot);
    if (this.isRed(fromSlot)) return this.redPalace.includes(toSlot);
    return false;
  }

  legalAdvisorMoves(slot) {
    const result = [];
    this.diagonalSlots(slot, 1).filter((s) => this.inPalace(slot, s)).forEach((s) => {
      this.addIfUniversallyLegal(result, slot, s);
    });
    return result;
  }

  legalKingMoves(slot) {
    const result = [];
    this.orthogonalSlots(slot, 1).filter((s) => this.inPalace(slot, s)).forEach((s) => {
      this.addIfUniversallyLegal(result, slot, s);
    });
    return result;
  }

  legalMoves(allowSelfCheck = false) {
    const result = this.board.map((code, slot) => {
      if (code === 'p' || code === 'P') return this.legalPawnMoves(slot);
      if (code === 'h' || code === 'H') return this.legalHorseMoves(slot);
      if (code === 'r' || code === 'R') return this.legalRookMoves(slot);
      if (code === 'c' || code === 'C') return this.legalCannonMoves(slot);
      if (code === 'e' || code === 'E') return this.legalElephantMoves(slot);
      if (code === 'a' || code === 'A') return this.legalAdvisorMoves(slot);
      if (code === 'k' || code === 'K') return this.legalKingMoves(slot);
      return [];
    });

    if (allowSelfCheck) return result;

    return result.map((toSlots, fromSlot) => (
      toSlots.filter((toSlot) => (!this.checksOwnKing(fromSlot, toSlot)))
    ));
  }

  filteredLegalMoves(selectFunc) {
    return this.legalMoves().map((toSlots, fromSlot) => {
      if (toSlots.length === 0 || !selectFunc(fromSlot)) return [];
      return toSlots;
    });
  }

  legalMovesByActiveColor(lastMovePiece = null) {
    const isActive = (
      this.isRedCode(lastMovePiece) ? this.isBlack : this.isRed
    ).bind(this);
    return this.filteredLegalMoves(isActive);
  }

  captures() {
    const result = new Set();
    for (const [, toSlots] of this.legalMoves(true).entries()) {
      toSlots.forEach((slot) => {
        if (this.isOccupied(slot)) result.add(this.board[slot]);
      });
    }
    return result;
  }

  // HACK: king facing logic implemented by replacing the
  //       opposing king with a rook
  kingInCheck(fromSlot, board = this.new(this.board)) {
    const code = this.board[fromSlot];
    let ownKing;
    let otherKing;
    let otherRook;
    if (this.isBlackCode(code)) [ownKing, otherKing, otherRook] = ['k', 'K', 'R'];
    if (this.isRedCode(code)) [ownKing, otherKing, otherRook] = ['K', 'k', 'r'];

    return board.drop(
      otherRook,
      board.board.indexOf(otherKing),
    ).captures().has(ownKing);
  }

  // HACK: king facing logic implemented by replacing the
  //       opposing king with a rook
  checksOwnKing(fromSlot, toSlot) {
    return this.kingInCheck(fromSlot, this.move(fromSlot, toSlot));
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

export const boardPropType = PropTypes.shape({
  ranks: PropTypes.number,
  files: PropTypes.number,
  redPieces: PropTypes.string,
  blackPieces: PropTypes.string,
  fen: PropTypes.string,
  redRiverBank: PropTypes.number,
  blackRiverBank: PropTypes.number,
  redPalace: PropTypes.arrayOf(PropTypes.number),
  blackPalace: PropTypes.arrayOf(PropTypes.number),
});
