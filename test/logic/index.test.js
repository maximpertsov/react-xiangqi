import XiangiBoard from 'services/logic';

describe('board', () => {
  // TODO: mock fen decoding
  const fen =
    'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';
  const board = new XiangiBoard({ fen });

  test('move', () => {
    expect(board.placement[0]).toBe('r');
    expect(board.placement[9]).toBe(null);

    const newBoard = board.move('a10a9');

    // Initial board did not change
    expect(board.placement[0]).toBe('r');
    expect(board.placement[9]).toBe(null);

    // Rook has moved forward on new board
    expect(newBoard.placement[0]).toBe(null);
    expect(newBoard.placement[9]).toBe('r');
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
});
