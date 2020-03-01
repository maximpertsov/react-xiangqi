describe('move reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([
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
