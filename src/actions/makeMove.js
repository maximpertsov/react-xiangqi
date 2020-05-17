import actions from 'actions';

const makeMove = move => dispatch => {
  dispatch(actions.game.moves.add(move));
  dispatch(actions.game.selectedMove.set(null));
  dispatch(actions.game.showConfirmMoveMenu.set(true));
};

export default makeMove;
