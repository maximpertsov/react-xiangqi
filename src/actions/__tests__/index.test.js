import actions from 'actions';

/* eslint-disable max-len */
test.each`
  creator                              | action                          | data
  ${actions.game.positions.add}        | ${'GAME/POSITIONS/ADD'}         | ${{}}
  ${actions.game.positions.update}     | ${'GAME/POSITIONS/UPDATE'}      | ${{}}
  ${actions.game.positions.remove}     | ${'GAME/POSITIONS/REMOVE'}      | ${{}}
  ${actions.game.positions.set}        | ${'GAME/POSITIONS/SET'}         | ${{ positions: [] }}
  ${actions.game.selectedPosition.set} | ${'GAME/SELECTED_POSITION/SET'} | ${0}
`(
  '$action creator returns proper action payload',
  ({ creator, action, data }) => {
    expect(creator(data)).toStrictEqual({ type: action, payload: data });
  },
);
/* eslint-enable max-len */
