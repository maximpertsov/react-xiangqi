import zipObject from 'lodash/zipObject';
import update from 'lodash/update';

const FEN_FIELDS = [
  'placement',
  'activeColor',
  'castling',
  'enPassant',
  'halfmoves',
  'fullmoves',
];

export const decodeFields = fen => {
  const result = zipObject(FEN_FIELDS, fen.split(' '));
  update(result, 'halfmoves', parseInt);
  update(result, 'fullmoves', parseInt);
  return result;
};

export const decode = fen => decodeFields(fen);

export default {};
