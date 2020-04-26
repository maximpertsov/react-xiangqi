import { addPosition, selectMove } from 'scenes/Game/actions';

const makeMove = position => dispatch => {
  dispatch(addPosition(position));
  dispatch(selectMove({ moveId: null }));
};

export default makeMove;
