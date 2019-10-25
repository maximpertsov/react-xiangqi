import update from 'immutability-helper';
import PropTypes from 'prop-types';
import sample from 'lodash.sample';
import {
  RefType,
  Color,
  Piece,
  BLACK_PIECES,
  RED_PIECES,
  RANK_COUNT,
  FILE_COUNT,
  BLACK_RIVER_BANK,
  RED_RIVER_BANK,
  ORTHOGONAL_MOVES,
  DIAGONAL_MOVES,
} from './logic/constants';

export { RefType };

const isPawn = (piece) => (
  piece === Piece.Black.PAWN || piece === Piece.Red.PAWN
);
const isChariot = (piece) => (
  piece === Piece.Black.CHARIOT || piece === Piece.Red.CHARIOT
);
const isHorse = (piece) => (
  piece === Piece.Black.HORSE || piece === Piece.Red.HORSE
);
const isElephant = (piece) => (
  piece === Piece.Black.ELEPHANT || piece === Piece.Red.ELEPHANT
);
const isGeneral = (piece) => (
  piece === Piece.Black.GENERAL || piece === Piece.Red.GENERAL
);
const isCannon = (piece) => (
  piece === Piece.Black.CANNON || piece === Piece.Red.CANNON
);
const isAdvisor = (piece) => (
  piece === Piece.Black.ADVISOR || piece === Piece.Red.ADVISOR
);

const getSlot = (rank, file) => file + (rank * FILE_COUNT);
const getRank = (slot) => Math.floor(slot / FILE_COUNT);
const getFile = (slot) => slot % FILE_COUNT;

const BLACK_PALACE = [
  [0, 3], [0, 4], [0, 5],
  [1, 3], [1, 4], [1, 5],
  [2, 3], [2, 4], [2, 5],
].map((pos) => getSlot(...pos));

const RED_PALACE = [
  [9, 3], [9, 4], [9, 5],
  [8, 3], [8, 4], [8, 5],
  [7, 3], [7, 4], [7, 5],
].map((pos) => getSlot(...pos));

const EMPTY_BOARD_FEN = '9/9/9/9/9/9/9/9/9/9';

export default class XiangqiBoard {
  // TODO can remove most of this information and parse it from the FEN string
  constructor({
    fen = EMPTY_BOARD_FEN,
  } = {}) {
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

  randomMove(color) {
    const legalMoves = this.legalMovesByColor(color);
    const randomMoves = legalMoves.reduce(
      (acc, toSlots, fromSlot) => {
        if (toSlots.length === 0) return acc;
        return acc.concat([[fromSlot, sample(toSlots)]]);
      },
      [],
    );
    // TODO: what if no legal move exists?
    return sample(randomMoves);
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
    return new this.constructor(options);
  }

  getPiece(pos, refType = RefType.SLOT) {
    const slot = this._slot(pos, refType);
    return this.board[slot];
  }

  getSlot(rank, file) { return getSlot(rank, file); }

  getRank(slot) { return getRank(slot); }

  getFile(slot) { return getFile(slot); }

  getRankFile(slot) { return [this.getRank(slot), this.getFile(slot)]; }

  isRedCode(code) { return RED_PIECES.includes(code); }

  isRed(slot) {
    const code = this.board[slot];
    return this.isRedCode(code);
  }

  isBlackCode(code) { return BLACK_PIECES.includes(code); }

  isBlack(slot) {
    const code = this.board[slot];
    return this.isBlackCode(code);
  }

  // TODO refactor and rename?
  isColor(color, slot) {
    const code = this.board[slot];
    if (color === Color.RED && this.isRedCode(code)) return true;
    if (color === Color.BLACK && this.isBlackCode(code)) return true;
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
    if (this.isBlack(slot)) nextRank = Math.min(rank + 1, RANK_COUNT - 1);
    if (this.isRed(slot)) nextRank = Math.max(rank - 1, 0);
    return this.getSlot(nextRank, file);
  }

  crossingRiver(fromSlot, toSlot) {
    const rank = this.getRank(toSlot);
    if (this.isBlack(fromSlot)) return rank >= RED_RIVER_BANK;
    if (this.isRed(fromSlot)) return rank <= BLACK_RIVER_BANK;
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
    if (newRank < 0 || newRank >= RANK_COUNT) return null;
    if (newFile < 0 || newFile >= FILE_COUNT) return null;
    return this.getSlot(newRank, newFile);
  }

  tryMoves(slot, moves) {
    return moves.map((m) => this.tryMove(slot, ...m));
  }

  // TODO make this non-recursive?
  tryMarch(slot, rankMove, fileMove, steps = Math.max(RANK_COUNT, FILE_COUNT)) {
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
    if (this.isBlack(fromSlot)) return BLACK_PALACE.includes(toSlot);
    if (this.isRed(fromSlot)) return RED_PALACE.includes(toSlot);
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
      if (isPawn(code)) return this.legalPawnMoves(slot);
      if (isChariot(code)) return this.legalRookMoves(slot);
      if (isHorse(code)) return this.legalHorseMoves(slot);
      if (isElephant(code)) return this.legalElephantMoves(slot);
      if (isGeneral(code)) return this.legalKingMoves(slot);
      if (isCannon(code)) return this.legalCannonMoves(slot);
      if (isAdvisor(code)) return this.legalAdvisorMoves(slot);
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

  legalMovesByColor(color) {
    let selectFunc;
    if (color === Color.BLACK) selectFunc = this.isBlack;
    if (color === Color.RED) selectFunc = this.isRed;
    if (selectFunc === undefined) selectFunc = () => false;
    return this.filteredLegalMoves(selectFunc.bind(this));
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

  findKingSlot(color) {
    let king;
    if (color === Color.BLACK) king = Piece.Black.GENERAL;
    if (color === Color.RED) king = Piece.Red.GENERAL;
    return this.board.indexOf(king);
  }

  // HACK: king facing logic implemented by replacing the
  //       opposing king with a rook
  kingInCheck(color, board = this.new(this.board)) {
    let ownKing;
    let otherKing;
    let otherRook;
    if (color === Color.BLACK) {
      [ownKing, otherKing, otherRook] = [
        Piece.Black.GENERAL,
        Piece.Red.GENERAL,
        Piece.Red.CHARIOT,
      ];
    } else if (color === Color.RED) {
      [ownKing, otherKing, otherRook] = [
        Piece.Red.GENERAL,
        Piece.Black.GENERAL,
        Piece.Black.CHARIOT,
      ];
    }

    return board.drop(
      otherRook,
      board.board.indexOf(otherKing),
    ).captures().has(ownKing);
  }

  // HACK: king facing logic implemented by replacing the
  //       opposing king with a rook
  checksOwnKing(fromSlot, toSlot) {
    let color;
    if (this.isBlack(fromSlot)) color = Color.BLACK;
    if (this.isRed(fromSlot)) color = Color.RED;
    return this.kingInCheck(color, this.move(fromSlot, toSlot));
  }

  toFen(board = this.board) {
    const rows = [];
    board.forEach((piece, idx) => {
      if (idx % FILE_COUNT === 0) rows.push([]);
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
  fen: PropTypes.string,
});
