import selectedSquare from 'reducers/selectedSquare';

describe('selected square reducer', () => {
  it('returns the initial state', () => {
    expect(selectedSquare(undefined, {})).toBe(null);
  });
});
