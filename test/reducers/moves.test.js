import moves, { DEFAULT_FEN } from 'reducers/moves';
import XiangqiBoard from 'services/logic';

describe('move reducers', () => {
  it('should return the initial state', () => {
    expect(moves(undefined, {})).toEqual([
      {
        id: 0,
        fromSlot: undefined,
        toSlot: undefined,
        piece: undefined,
        board: new XiangqiBoard({ fen: DEFAULT_FEN }),
        pending: false,
      },
    ]);
  });
});
