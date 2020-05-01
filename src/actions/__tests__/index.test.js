import actions from 'actions';

/* eslint-disable max-len */
test.each`
  creator                                 | action                               | data
  ${actions.game.players.set}             | ${'GAME/PLAYERS/SET'}                | ${[{}, {}]}
  ${actions.game.positions.add}           | ${'GAME/POSITIONS/ADD'}              | ${{}}
  ${actions.game.positions.update}        | ${'GAME/POSITIONS/UPDATE'}           | ${{}}
  ${actions.game.positions.remove}        | ${'GAME/POSITIONS/REMOVE'}           | ${0}
  ${actions.game.positions.set}           | ${'GAME/POSITIONS/SET'}              | ${[]}
  ${actions.game.selectedPosition.set}    | ${'GAME/SELECTED_POSITION/SET'}      | ${0}
  ${actions.game.showConfirmMoveMenu.set} | ${'GAME/SHOW_CONFIRM_MOVE_MENU/SET'} | ${true}
  ${actions.game.slug.set}                | ${'GAME/SLUG/SET'}                   | ${'ABC123'}
  ${actions.board.selectedSquare.set}     | ${'BOARD/SELECTED_SQUARE/SET'}       | ${'a1a2'}
`(
  '$action creator returns proper action payload',
  ({ creator, action, data }) => {
    expect(creator(data)).toStrictEqual({ type: action, payload: data });
  },
);
/* eslint-enable max-len */
