import { fromFen } from './utils';

test('converts FEN string to a 2d array', () => {
  const fen = 'rheakaehr/9/2c3c2/p1p1p1p1p/9/9/P1P1P1P1P/2C3C2/9/RHEAKAEHR';
  const expBoard = [
    ['r', 'h', 'e', 'a', 'k', 'a', 'e', 'h', 'r'],
  ];
  const board = fromFen(fen);
});
