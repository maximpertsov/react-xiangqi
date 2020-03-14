import XiangiBoard from 'services/logic';
import { Color } from 'services/logic/constants';

describe('board', () => {
  // TODO: mock fen decoding
  const fen =
    'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';
  const board = new XiangiBoard({ fen });

  test('get piece', () => {
    expect(board.getPiece('a10')).toBe('r');
    expect(board.getPiece('a9')).toBe(null);
  });

  test('is occupied', () => {
    expect(board.isOccupied('a10')).toBe(true);
    expect(board.isOccupied('a9')).toBe(false);
  });

  test('is same color', () => {
    // two black pieces
    expect(board.sameColor('a10', 'b10')).toBe(true);
    // Two red pieces
    expect(board.sameColor('a1', 'b1')).toBe(true);
    // black and red piece
    expect(board.sameColor('a10', 'a1')).toBe(false);
    // black and unoccupied
    expect(board.sameColor('a10', 'a9')).toBe(false);
    // two unoccupied squares
    expect(board.sameColor('a9', 'b9')).toBe(false);
  });

  test('is active king', () => {
    expect(board.activeKing()).toBe('e1');

    const newFen =
      '1nbakabnr/r8/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR b - - 0 1';
    const newBoard = new XiangiBoard({ fen: newFen });
    expect(newBoard.activeKing()).toBe('e10');
  });

  test('move', () => {
    expect(board.activeColor).toBe(Color.RED);
    expect(board.getPiece('a10')).toBe('r');
    expect(board.getPiece('a9')).toBe(null);

    const newBoard = board.move('a10a9');

    // Initial board did not change
    expect(board.activeColor).toBe(Color.RED);
    expect(board.getPiece('a10')).toBe('r');
    expect(board.getPiece('a9')).toBe(null);

    // Rook has moved forward on new board
    expect(newBoard.activeColor).toBe(Color.BLACK);
    expect(newBoard.getPiece('a10')).toBe(null);
    expect(newBoard.getPiece('a9')).toBe('r');
  });
});
