import reducer from 'reducers/lastPositionIsPending';

describe('positions reducer', () => {
  it('should return the default state', () => {
    expect(reducer(undefined, {})).toEqual(false);
  });

  it('should update the pending position id', () => {
    const action = { type: 'update_last_position_is_pending', value: true };

    const currentState = false;
    expect(reducer(currentState, action)).toBeTruthy();
  });
});
