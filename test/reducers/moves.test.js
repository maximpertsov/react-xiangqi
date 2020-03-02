import moves, { DEFAULT_FEN } from 'reducers/moves';
import XiangqiBoard from 'services/logic';

describe('move reducers', () => {
  const initialMove = {
    id: 0,
    fromSlot: undefined,
    toSlot: undefined,
    piece: undefined,
    board: new XiangqiBoard({ fen: DEFAULT_FEN }),
    pending: false,
  };

  it('should return the initial state', () => {
    expect(moves(undefined, {})).toEqual([initialMove]);
  });

  it('should add a move', () => {
    const action = { type: 'add_move' };

    expect(moves(undefined, action)).toEqual([initialMove]);
  });
});
