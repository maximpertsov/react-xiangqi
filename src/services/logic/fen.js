import zipObject from 'lodash/zipObject';
import update from 'lodash/update';
import { Color } from 'services/logic/constants';
import { decodeSquare, encodeSquare } from 'services/logic/square';
import { sameColor as sameColorPieces } from 'services/logic/utils';

const FEN_FIELDS = [
  'placement',
  'activeColor',
  'castling',
  'enPassant',
  'halfmoves',
  'fullmoves',
];

const _activeColor = symbol => {
  switch (symbol) {
    case 'w':
      return Color.RED;
    case 'b':
      return Color.BLACK;
    default:
      return null;
    // TODO: throw an error if the piece color is not 'w' or 'b'
    // throw new Error(`Invalid piece color ${symbol}`);
  }
};

const decodeFields = fen => {
  const result = zipObject(FEN_FIELDS, fen.split(' '));
  update(result, 'activeColor', _activeColor);
  update(result, 'halfmoves', parseInt);
  update(result, 'fullmoves', parseInt);
  return result;
};

const decodeRow = row =>
  row.split('').reduce((acc, ch) => {
    const val = +ch;
    const newItems = Number.isNaN(val) ? [ch] : Array(val).fill(null);
    return acc.concat(newItems);
  }, []);

const decodePlacement = placement =>
  placement.split('/').reduce((acc, row) => acc.concat(decodeRow(row)), []);

export const decodeFen = fen => {
  const result = decodeFields(fen);
  update(result, 'placement', decodePlacement);
  return result;
};

export const isOccupied = (fen, square) => {
  const slot = decodeSquare(square);

  return decodeFen(fen).placement[slot] !== null;
};

export const getPiece = (fen, square) =>
  decodeFen(fen).placement[decodeSquare(square)];

export const activeColor = fen => decodeFen(fen).activeColor;

export const sameColor = (fen, square1, square2) => {
  const piece1 = getPiece(fen, square1);
  const piece2 = getPiece(fen, square2);

  return sameColorPieces(piece1, piece2);
};

export const activeKing = fen => {
  const { activeColor, placement } = decodeFen(fen);
  let king = undefined;

  switch (activeColor) {
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

  const kingSlot = placement.indexOf(king);
  return encodeSquare(kingSlot);
};

export const moveOrder = fen => {
  const { activeColor, fullmoves } = decodeFen(fen);
  return fullmoves * 2 - (activeColor === Color.RED ? 1 : 0);
};

export default {};
