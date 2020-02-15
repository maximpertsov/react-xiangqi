import { getRankFile } from './utils';

const RANKS = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
const FILES = 'ABCDEFGHI'.split('');

export const encode = slot => {
  const [rank, file] = getRankFile(slot);
  return `${FILES[file]}${RANKS[rank]}`;
};

export const decode = square => square;

export default {};
