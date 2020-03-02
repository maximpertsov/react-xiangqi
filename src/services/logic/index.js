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
import { decode as decodeFen } from './fen';
import { makeMove } from './move';
import {
  decode as decodeSquare,
  encode as encodeSquare,
  encodeMove,
} from './square';

export { RefType };

// TODO: re-const is ugly
export const { getSlot, getRank, getFile, getRankFile } = utils;

export default class XiangqiBoard {
  // TODO can remove most of this information and parse it from the FEN string
  constructor({ fen, ...options }) {
    const params = fen === undefined ? options : decodeFen(fen);
    this.placement = params.placement;
    this.activeColor = params.activeColor;
  }

  _slot(pos, refType) {
    if (refType === RefType.SLOT) return pos;
    if (refType === RefType.RANK_FILE) {
      const [rank, file] = pos;
      return getSlot(rank, file);
    }
    if (refType === RefType.RANK_FILE_STRING) {
      const _pos = pos.split(',').map(x => +x);
      return this._slot(_pos, RefType.RANK_FILE);
    }
    throw new Error(`Invalid reference type: ${refType}`);
  }

  move(move) {
    return this.new({ placement: makeMove(this.placement, move) });
  }

  randomMove(color) {
    const legalMoves = this.legalMovesByColor(color);
    const randomMoves = legalMoves.reduce((acc, toSlots, fromSlot) => {
      if (toSlots.length === 0) return acc;
      return acc.concat([[fromSlot, sample(toSlots)]]);
    }, []);
    // TODO: what if no legal move exists?
    return sample(randomMoves);
  }

  drop(piece, pos, refType = RefType.SLOT) {
    const slot = this._slot(pos, refType);
    const placement = update(this.placement, {
      [slot]: { $set: piece },
    });
    return this.new({ placement });
  }

  new(options) {
    return new this.constructor(
      options === undefined ? { ...this } : { ...options },
    );
  }

  getPiece(square) {
    return this.placement[decodeSquare(square)];
  }

  isRed(slot) {
    const piece = this.placement[slot];
    return utils.isRed(piece);
  }

  isBlack(slot) {
    const piece = this.placement[slot];
    return utils.isBlack(piece);
  }

  // TODO: add test
  isColor(color, slot) {
    if (color === Color.RED && this.isRed(slot)) return true;
    if (color === Color.BLACK && this.isBlack(slot)) return true;
    return false;
  }

  sameColor(square1, square2) {
    const slot1 = decodeSquare(square1);
    const slot2 = decodeSquare(square2);
    const piece1 = this.placement[slot1];
    const piece2 = this.placement[slot2];

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
    if (this.sameColor(encodeSquare(fromSlot), encodeSquare(toSlot))) {
      return false;
    }
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

  isOccupied(square) {
    const slot = decodeSquare(square);

    return this.placement[slot] !== null;
  }

  legalHorseMoves(slot) {
    const result = [];

    utils.orthogonalSlots(slot).forEach((firstHop, _, firstHops) => {
      if (this.isOccupied(encodeSquare(firstHop))) return;

      utils.diagonalSlots(firstHop).forEach(secondHop => {
        if (firstHops.includes(secondHop) || result.includes(secondHop)) return;
        this.addIfUniversallyLegal(result, slot, secondHop);
      });
    });

    return result;
  }

  legalRookMoves(slot) {
    const result = [];
    ORTHOGONAL_MOVES.forEach(move => {
      let toSlot = slot;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        toSlot = utils.tryMove(toSlot, ...move);
        if (toSlot === null) break;
        this.addIfUniversallyLegal(result, slot, toSlot);
        if (this.isOccupied(encodeSquare(toSlot))) break;
      }
    });
    return result;
  }

  legalCannonMoves(slot) {
    const result = [];
    // eslint-disable-next-line complexity
    ORTHOGONAL_MOVES.forEach(move => {
      let toSlot = slot;
      let vaulted = false;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        toSlot = utils.tryMove(toSlot, ...move);
        if (toSlot === null) break;
        if (vaulted && this.isOccupied(encodeSquare(toSlot))) {
          this.addIfUniversallyLegal(result, slot, toSlot);
          break;
        } else if (this.isOccupied(encodeSquare(toSlot))) {
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
    DIAGONAL_MOVES.forEach(move => {
      const firstHop = utils.tryMove(slot, ...move);
      if (
        this.isOccupied(encodeSquare(firstHop)) ||
        this.crossingRiver(slot, firstHop)
      ) {
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
    utils
      .diagonalSlots(slot, 1)
      .filter(s => this.inPalace(slot, s))
      .forEach(s => {
        this.addIfUniversallyLegal(result, slot, s);
      });
    return result;
  }

  legalKingMoves(slot) {
    const result = [];
    utils
      .orthogonalSlots(slot, 1)
      .filter(s => this.inPalace(slot, s))
      .forEach(s => {
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

  noLegalMoves() {
    return this.placement.map(() => []);
  }

  legalMoves(allowSelfCheck = false) {
    const result = this.placement.map((piece, slot) =>
      this.legalMovePiece(piece, slot),
    );

    if (allowSelfCheck) return result;

    return result.map((toSlots, fromSlot) =>
      toSlots.filter(toSlot => !this.checksOwnKing(fromSlot, toSlot)),
    );
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
    return this.legalMovesByColor(color).some(toSlots => toSlots.length > 0);
  }

  captures() {
    const result = new Set();
    for (const [, toSlots] of this.legalMoves(true).entries()) {
      toSlots.forEach(slot => {
        if (this.isOccupied(encodeSquare(slot))) {
          result.add(this.placement[slot]);
        }
      });
    }
    return result;
  }

  findKingSlot(color) {
    let king;
    if (color === Color.BLACK) king = Piece.Black.GENERAL;
    if (color === Color.RED) king = Piece.Red.GENERAL;
    return this.placement.indexOf(king);
  }

  // HACK: king facing logic implemented by replacing the
  //       opposing king with a rook
  kingInCheck(color, board = this.new({ placement: this.placement })) {
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

    return board
      .drop(otherRook, board.placement.indexOf(otherKing))
      .captures()
      .has(ownKing);
  }

  // HACK: king facing logic implemented by replacing the
  //       opposing king with a rook
  checksOwnKing(fromSlot, toSlot) {
    let color;
    if (this.isBlack(fromSlot)) color = Color.BLACK;
    if (this.isRed(fromSlot)) color = Color.RED;
    return this.kingInCheck(color, this.move(encodeMove(fromSlot, toSlot)));
  }

  // Board-Slot interactions
  inCheck({ slot, nextMoveColor }) {
    if (!this.kingInCheck(nextMoveColor)) return false;
    return this.findKingSlot(nextMoveColor) === slot;
  }

  toFen(placement = this.placement) {
    const rows = [];
    placement.forEach((piece, idx) => {
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
    return rows.map(row => row.join('')).join('/');
  }
}

export const boardPropType = PropTypes.shape({
  fen: PropTypes.string,
});
