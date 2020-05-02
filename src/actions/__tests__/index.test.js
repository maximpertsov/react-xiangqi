import actions from 'actions';

const { home, game, board } = actions;

/* eslint-disable max-len */
test.each`
  creator                         | action                               | data
  ${board.animationOffset.set}    | ${'BOARD/ANIMATION_OFFSET/SET'}      | ${{}}
  ${board.animationOffset.clear}  | ${'BOARD/ANIMATION_OFFSET/CLEAR'}    | ${[0, 0]}
  ${board.selectedSquare.set}     | ${'BOARD/SELECTED_SQUARE/SET'}       | ${'a1a2'}
  ${game.requestedTakeback.set}   | ${'GAME/REQUESTED_TAKEBACK/SET'}     | ${true}
  ${game.canMoveBothColors.set}   | ${'GAME/CAN_MOVE_BOTH_COLORS/SET'}   | ${true}
  ${game.players.set}             | ${'GAME/PLAYERS/SET'}                | ${[{}, {}]}
  ${game.positions.add}           | ${'GAME/POSITIONS/ADD'}              | ${{}}
  ${game.positions.update}        | ${'GAME/POSITIONS/UPDATE'}           | ${{}}
  ${game.positions.remove}        | ${'GAME/POSITIONS/REMOVE'}           | ${0}
  ${game.positions.set}           | ${'GAME/POSITIONS/SET'}              | ${[]}
  ${game.selectedPosition.set}    | ${'GAME/SELECTED_POSITION/SET'}      | ${0}
  ${game.showConfirmMoveMenu.set} | ${'GAME/SHOW_CONFIRM_MOVE_MENU/SET'} | ${true}
  ${game.slug.set}                | ${'GAME/SLUG/SET'}                   | ${'ABC123'}
  ${game.updateCount.set}         | ${'GAME/UPDATE_COUNT/SET'}           | ${10}
  ${home.autoMove.set.off}        | ${'HOME/AUTO_MOVE/SET/OFF'}          | ${[]}
  ${home.autoMove.set.red}        | ${'HOME/AUTO_MOVE/SET/RED'}          | ${['red']}
  ${home.autoMove.set.black}      | ${'HOME/AUTO_MOVE/SET/BLACK'}        | ${['black']}
  ${home.autoMove.set.both}       | ${'HOME/AUTO_MOVE/SET/BOTH'}         | ${['red', 'black']}
  ${home.username.set}            | ${'HOME/USERNAME/SET'}               | ${'user'}
  ${home.showGame.set}            | ${'HOME/SHOW_GAME/SET'}              | ${true}
`(
  '$action creator returns proper action payload',
  ({ creator, action, data }) => {
    expect(creator(data)).toStrictEqual({ type: action, payload: data });
  },
);
/* eslint-enable max-len */
