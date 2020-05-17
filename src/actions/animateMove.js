import actions from 'actions';
import { decodeFan } from 'services/logic/square';
import { getRankFile } from 'services/logic/utils';

const animateMove = ({ bottomPlayerIsRed, move }) => dispatch => {
  const [fromSlot, toSlot] = decodeFan(move);
  const [fromY, fromX] = getRankFile(fromSlot);
  const [toY, toX] = getRankFile(toSlot);

  const offset = [
    (bottomPlayerIsRed ? 1 : -1) * (toX - fromX),
    (bottomPlayerIsRed ? 1 : -1) * (toY - fromY),
  ];

  dispatch(actions.board.animationOffset.set(offset));
};

export default animateMove;
