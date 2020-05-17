import { getRankFile, getSlot } from './utils';

const RANKS = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
const FILES = 'abcdefghi'.split('');

export const decode = square => {
  const rank = RANKS.indexOf(square.substring(1));
  const file = FILES.indexOf(square.substring(0, 1));

  return getSlot(rank, file);
};

export const encode = slot => {
  const [rank, file] = getRankFile(slot);
  return `${FILES[file]}${RANKS[rank]}`;
};

// TODO: this could be become inconsisten with the server, consider removing
// and replacing dependencies with something more stable
export const squaresToFan = (fromSquare, toSquare) =>
  `${fromSquare}${toSquare}`;

export const fanToSquares = fan => fan.match(/([a-z][0-9]+)/g);

export const encodeFan = (fromSlot, toSlot) =>
  `${encode(fromSlot)}${encode(toSlot)}`;

export const decodeFan = fan =>
  fanToSquares(fan).map(square => decode(square));

export default {};
