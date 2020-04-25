import reducer from 'reducers/pendingPositionId';

describe('positions reducer', () => {
  it('should return the default state', () => {
    expect(reducer(undefined, {})).toEqual(null);
  });

  it('should update the pending position id', () => {
    const action = { type: 'update_pending_position', id: 1 };

    const currentState = null;
    const expectedNewState = 1;
    expect(reducer(currentState, action)).toEqual(expectedNewState);
  });
});
