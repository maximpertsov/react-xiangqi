import reducer from 'reducers/showConfirmMoveMenu';

describe('positions reducer', () => {
  it('should return the default state', () => {
    expect(reducer(undefined, {})).toEqual(false);
  });

  it('should update the pending position id', () => {
    const action = { type: 'toggle_show_confirm_move_menu', value: true };

    const currentState = false;
    expect(reducer(currentState, action)).toBeTruthy();
  });
});
