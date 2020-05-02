import actions from 'actions';

const makeMove = position => dispatch => {
  dispatch(actions.game.positions.add(position));
  dispatch(actions.game.selectedPosition.set(null));
  dispatch(actions.game.showConfirmMoveMenu.set(true));
};

export default makeMove;
