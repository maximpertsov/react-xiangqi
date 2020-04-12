import { Color } from './constants';
import { sameColor } from './utils';
import { decode as decodeFen } from './fen';
import { decode as decodeSquare, encode as encodeSquare } from './square';

export default class XiangqiBoard {
  constructor({ fen }) {
    const params = decodeFen(fen);

    this.placement = params.placement;
    this.activeColor = params.activeColor;
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
