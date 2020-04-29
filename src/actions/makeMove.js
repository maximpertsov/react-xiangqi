import actions from 'actions';

const makeMove = position => dispatch => {
  dispatch(actions.game.positions.add(position));
  dispatch(actions.game.selectedPosition.set(null));
  dispatch({ type: 'toggle_show_confirm_move_menu', value: true });
};

export default makeMove;
