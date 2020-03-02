import zipObject from 'lodash/zipObject';
import update from 'lodash/update';
import { Color } from 'service/logic/constants'

const FEN_FIELDS = [
  'placement',
  'activeColor',
  'castling',
  'enPassant',
  'halfmoves',
  'fullmoves',
];

const activeColor = (symbol) => {
  switch (symbol) {
    case 'w':
      return Color.RED
    case 'b':
      return Color.BLACK
    default:
      throw new Error(`Invalid piece color ${symbol}`);
  }

const decodeFields = fen => {
  const result = zipObject(FEN_FIELDS, fen.split(' '));
  update(result, 'activeColor', activeColor);
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

export const decode = fen => {
  const result = decodeFields(fen);
  update(result, 'placement', decodePlacement);
  return result;
};

export default {};
