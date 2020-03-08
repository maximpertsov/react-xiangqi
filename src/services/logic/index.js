import { Color } from './constants';
import { sameColor } from './utils';
import { decode as decodeFen } from './fen';
import { makeMove } from './move';
import { decode as decodeSquare, encode as encodeSquare } from './square';

export default class XiangqiBoard {
  constructor({ fen, ...options }) {
    const params = fen === undefined ? options : decodeFen(fen);
    this.placement = params.placement;
    this.activeColor = params.activeColor;
  }

  // TODO: keep and test
  move(move) {
    return this.new({ placement: makeMove(this.placement, move) });
  }

  new(options) {
    return new this.constructor(
      options === undefined ? { ...this } : { ...options },
    );
  }

  getPiece(square) {
    return this.placement[decodeSquare(square)];
  }

  sameColor(square1, square2) {
    const slot1 = decodeSquare(square1);
    const slot2 = decodeSquare(square2);
    const piece1 = this.placement[slot1];
    const piece2 = this.placement[slot2];

    return sameColor(piece1, piece2);
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
}
