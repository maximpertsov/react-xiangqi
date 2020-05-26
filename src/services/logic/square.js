import { getRankFile, getSlot } from './utils';

const RANKS = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
const FILES = 'abcdefghi'.split('');

export const decodeSquare = square => {
  const rank = RANKS.indexOf(square.substring(1));
  const file = FILES.indexOf(square.substring(0, 1));

  return getSlot(rank, file);
};

export const encodeSquare = slot => {
  const [rank, file] = getRankFile(slot);
  return `${FILES[file]}${RANKS[rank]}`;
};

// TODO: this could be become inconsisten with the server, consider removing
// and replacing dependencies with something more stable
export const squaresToUci = (fromSquare, toSquare) =>
  `${fromSquare}${toSquare}`;

export const uciToSquares = uci => uci.match(/([a-z][0-9]+)/g);

export const encodeUci = (fromSlot, toSlot) =>
  `${encodeSquare(fromSlot)}${encodeSquare(toSlot)}`;

export const decodeUci = uci =>
  uciToSquares(uci).map(square => decodeSquare(square));

export default {};
