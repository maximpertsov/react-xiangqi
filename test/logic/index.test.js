import XiangiBoard from 'services/logic';

describe('board', () => {
  // TODO: mock fen decoding
  const fen =
    'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

  test('move', () => {
    const board = new XiangiBoard({ fen });

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
});
