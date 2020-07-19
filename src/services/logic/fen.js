import update from 'lodash/update';
import zipObject from 'lodash/zipObject';

import { Team } from 'services/logic/constants';
import { decodeSquare, encodeSquare } from 'services/logic/square';
import { sameTeam as sameTeamPieces } from 'services/logic/utils';

const FEN_FIELDS = [
  'placement',
  'activeTeam',
  'castling',
  'enPassant',
  'halfmoves',
  'fullmoves',
];

const _activeTeam = symbol => {
  switch (symbol) {
    case 'w':
      return Team.RED;
    case 'b':
      return Team.BLACK;
    default:
      return null;
    // TODO: throw an error if the piece team is not 'w' or 'b'
    // throw new Error(`Invalid piece team ${symbol}`);
  }
};

const decodeFields = fen => {
  const result = zipObject(FEN_FIELDS, fen.split(' '));
  update(result, 'activeTeam', _activeTeam);
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

export const activeTeam = fen => decodeFen(fen).activeTeam;

export const sameTeam = (fen, square1, square2) => {
  const piece1 = getPiece(fen, square1);
  const piece2 = getPiece(fen, square2);

  return sameTeamPieces(piece1, piece2);
};

export const activeKing = fen => {
  const { activeTeam, placement } = decodeFen(fen);
  let king = undefined;

  switch (activeTeam) {
    case Team.RED:
      king = 'K';
      break;
    case Team.BLACK:
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
  const { activeTeam, fullmoves } = decodeFen(fen);
  return fullmoves * 2 - (activeTeam === Team.RED ? 1 : 0);
};

export default {};
