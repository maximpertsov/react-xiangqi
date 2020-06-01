import actions from 'actions';

const makeMove = move => dispatch => {
  dispatch(actions.game.moves.add(move));
  dispatch(actions.game.selectedFen.set(move.fen));
  dispatch(actions.game.showConfirmMoveMenu.set(true));
};

export default makeMove;
