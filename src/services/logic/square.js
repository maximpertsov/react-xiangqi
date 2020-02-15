import { getRankFile, getSlot } from './utils';

const RANKS = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
const FILES = 'ABCDEFGHI'.split('');

export const decode = square => {
  const rank = RANKS.indexOf(square.substring(1));
  const file = FILES.indexOf(square.substring(0, 1));

  return getSlot(rank, file);
};

export const encode = slot => {
  const [rank, file] = getRankFile(slot);
  return `${FILES[file]}${RANKS[rank]}`;
};

export const encodeMove = (fromSlot, toSlot) =>
  `${encode(fromSlot)}${encode(toSlot)}`;

export const decodeMove = (move) => move;

export default {};
