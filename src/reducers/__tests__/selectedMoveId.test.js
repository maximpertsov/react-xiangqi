import selectedMoveId from 'reducers/selectedMoveId';

describe('selected move id reducer', () => {
  it('returns the initial state', () => {
    expect(selectedMoveId(undefined, {})).toBe(null);
  });

  it('sets the selected move', () => {
    const action = { type: 'GAME/SELECTED_POSITION/SET', payload: 1 };

    expect(selectedMoveId(0, action)).toEqual(1);
  });
});
