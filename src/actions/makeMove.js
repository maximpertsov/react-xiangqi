import { addPosition, selectMove } from 'actions';

const makeMove = position => dispatch => {
  dispatch(addPosition(position));
  dispatch(selectMove({ moveId: null }));
  dispatch({ type: 'toggle_show_confirm_move_menu', value: true });
};

export default makeMove;
