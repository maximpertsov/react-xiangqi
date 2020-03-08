import update from 'immutability-helper';
import PropTypes from 'prop-types';
import {
  RefType,
  Color,
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
} from './square';

export { RefType };

// TODO: re-const is ugly
export const { getSlot, getRank, getFile, getRankFile } = utils;

export default class XiangqiBoard {
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

  // TODO: keep and test
  move(move) {
    return this.new({ placement: makeMove(this.placement, move) });
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

  activeKing() {
    let king = undefined;

    switch (this.activeColor) {
      case Color.RED:
        king = 'K';
        break;
      case Color.BLACK:
        king = 'k';
        break;
      default:
        // TODO: throw error
        return;
    }

    const kingSlot = this.placement.indexOf(king);
    return encodeSquare(kingSlot);
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
