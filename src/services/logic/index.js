import update from 'immutability-helper';
import PropTypes from 'prop-types';
import sample from 'lodash.sample';
import {
  RefType,
  Color,
  Piece,
  EMPTY_BOARD_FEN,
  RANK_COUNT,
  FILE_COUNT,
  BLACK_RIVER_BANK,
  RED_RIVER_BANK,
  ORTHOGONAL_MOVES,
  DIAGONAL_MOVES,
} from './constants';
import * as utils from './utils';

export { RefType };

// TODO: re-const is ugly
export const {
  getSlot, getRank, getFile, getRankFile, fromFen,
} = utils;

export default class XiangqiBoard {
  // TODO can remove most of this information and parse it from the FEN string
  constructor({ fen = EMPTY_BOARD_FEN } = {}) {
    this.board = utils.fromFen(fen);
  }

  _slot(pos, refType) {
    if (refType === RefType.SLOT) return pos;
    if (refType === RefType.RANK_FILE) {
      const [rank, file] = pos;
      return getSlot(rank, file);
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

  isRed(slot) {
    const piece = this.board[slot];
    return utils.isRed(piece);
  }

  isBlack(slot) {
    const piece = this.board[slot];
    return utils.isBlack(piece);
  }

  // TODO: add test
  isColor(color, slot) {
    if (color === Color.RED && this.isRed(slot)) return true;
    if (color === Color.BLACK && this.isBlack(slot)) return true;
    return false;
  }

  sameColor(slot1, slot2) {
    const piece1 = this.board[slot1];
    const piece2 = this.board[slot2];
    return utils.sameColor(piece1, piece2);
  }

  getNextRankSlot(slot) {
    const rank = getRank(slot);
    const file = getFile(slot);
    let nextRank = rank;
    if (this.isBlack(slot)) nextRank = Math.min(rank + 1, RANK_COUNT - 1);
    if (this.isRed(slot)) nextRank = Math.max(rank - 1, 0);
    return getSlot(nextRank, file);
  }

  crossingRiver(fromSlot, toSlot) {
    const rank = getRank(toSlot);
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

  legalPawnMoves(slot) {
    const result = [];
    const forwardSlot = this.getNextRankSlot(slot);
    this.addIfUniversallyLegal(result, slot, forwardSlot);
    if (this.crossingRiver(slot, slot)) {
      this.addIfUniversallyLegal(result, slot, utils.tryMove(slot, 0, -1));
      this.addIfUniversallyLegal(result, slot, utils.tryMove(slot, 0, 1));
    }
    return result;
  }

  isOccupied(slot) {
    return this.board[slot] !== null;
  }

  legalHorseMoves(slot) {
    const result = [];

    utils.orthogonalSlots(slot).forEach((firstHop, _, firstHops) => {
      if (this.isOccupied(firstHop)) return;

      utils.diagonalSlots(firstHop).forEach((secondHop) => {
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
      // eslint-disable-next-line no-constant-condition
      while (true) {
        toSlot = utils.tryMove(toSlot, ...move);
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
      // eslint-disable-next-line no-constant-condition
      while (true) {
        toSlot = utils.tryMove(toSlot, ...move);
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
      const firstHop = utils.tryMove(slot, ...move);
      if (this.isOccupied(firstHop) || this.crossingRiver(slot, firstHop)) {
        return;
      }

      const secondHop = utils.tryMove(firstHop, ...move);
      this.addIfUniversallyLegal(result, slot, secondHop);
    });
    return result;
  }

  inPalace(fromSlot, toSlot) {
    if (this.isBlack(fromSlot)) return utils.inBlackPalace(toSlot);
    if (this.isRed(fromSlot)) return utils.inRedPalace(toSlot);
    return false;
  }

  legalAdvisorMoves(slot) {
    const result = [];
    utils.diagonalSlots(slot, 1).filter(
      (s) => this.inPalace(slot, s),
    ).forEach((s) => {
      this.addIfUniversallyLegal(result, slot, s);
    });
    return result;
  }

  legalKingMoves(slot) {
    const result = [];
    utils.orthogonalSlots(slot, 1).filter(
      (s) => this.inPalace(slot, s),
    ).forEach((s) => {
      this.addIfUniversallyLegal(result, slot, s);
    });
    return result;
  }

  // eslint-disable-next-line complexity
  legalMovePiece(piece, slot) {
    if (utils.isPawn(piece)) return this.legalPawnMoves(slot);
    if (utils.isChariot(piece)) return this.legalRookMoves(slot);
    if (utils.isHorse(piece)) return this.legalHorseMoves(slot);
    if (utils.isElephant(piece)) return this.legalElephantMoves(slot);
    if (utils.isGeneral(piece)) return this.legalKingMoves(slot);
    if (utils.isCannon(piece)) return this.legalCannonMoves(slot);
    if (utils.isAdvisor(piece)) return this.legalAdvisorMoves(slot);
    return [];
  }

  legalMoves(allowSelfCheck = false) {
    const result = this.board.map(
      (piece, slot) => this.legalMovePiece(piece, slot),
    );

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

  hasLegalMoves(color) {
    return this.legalMovesByColor(color).some((toSlots) => toSlots.length > 0);
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
        lastRow[lastRowSize - 1] += 1;
      }
    });
    return rows.map((row) => row.join('')).join('/');
  }
}

export const boardPropType = PropTypes.shape({
  fen: PropTypes.string,
});
