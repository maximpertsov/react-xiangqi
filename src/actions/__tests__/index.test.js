import actions from 'actions';

const { home, game, board } = actions;

/* eslint-disable max-len */
test.each`
  creator                         | action                               | data
  ${board.animationOffset.set}    | ${'BOARD/ANIMATION_OFFSET/SET'}      | ${{}}
  ${board.animationOffset.clear}  | ${'BOARD/ANIMATION_OFFSET/CLEAR'}    | ${[0, 0]}
  ${board.selectedSquare.set}     | ${'BOARD/SELECTED_SQUARE/SET'}       | ${'a1a2'}
  ${game.moves.add}               | ${'GAME/MOVES/ADD'}                  | ${{}}
  ${game.moves.update}            | ${'GAME/MOVES/UPDATE'}               | ${{}}
  ${game.moves.remove}            | ${'GAME/MOVES/REMOVE'}               | ${0}
  ${game.moves.set}               | ${'GAME/MOVES/SET'}                  | ${[]}
  ${game.selectedFen.set}         | ${'GAME/SELECTED_FEN/SET'}           | ${'FEN'}
  ${game.showConfirmMoveMenu.set} | ${'GAME/SHOW_CONFIRM_MOVE_MENU/SET'} | ${true}
  ${game.slug.set}                | ${'GAME/SLUG/SET'}                   | ${'ABC123'}
  ${home.autoMove.set.off}        | ${'HOME/AUTO_MOVE/SET/OFF'}          | ${[]}
  ${home.autoMove.set.red}        | ${'HOME/AUTO_MOVE/SET/RED'}          | ${['red']}
  ${home.autoMove.set.black}      | ${'HOME/AUTO_MOVE/SET/BLACK'}        | ${['black']}
  ${home.autoMove.set.both}       | ${'HOME/AUTO_MOVE/SET/BOTH'}         | ${['red', 'black']}
  ${home.games.set}               | ${'HOME/GAMES/SET'}                  | ${[{}]}
  ${home.loginForm.username.set}  | ${'HOME/LOGIN_FORM/USERNAME/SET'}    | ${'user123'}
  ${home.loginForm.password.set}  | ${'HOME/LOGIN_FORM/PASSWORD/SET'}    | ${'pass123'}
  ${home.loginForm.error.set}     | ${'HOME/LOGIN_FORM/ERROR/SET'}       | ${'failed!'}
  ${home.loginForm.loading.set}   | ${'HOME/LOGIN_FORM/LOADING/SET'}     | ${true}
  ${home.username.set}            | ${'HOME/USERNAME/SET'}               | ${'user123'}
  ${home.showGame.set}            | ${'HOME/SHOW_GAME/SET'}              | ${true}
`(
  '$action creator returns proper action payload',
  ({ creator, action, data }) => {
    expect(creator(data)).toStrictEqual({ type: action, payload: data });
  },
);
/* eslint-enable max-len */
