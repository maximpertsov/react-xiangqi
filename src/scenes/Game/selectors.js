import * as utils from 'services/logic/utils';
import { Color } from 'services/logic/constants';

export const getMove = ({ moves }, idx) => moves[idx];

export const getLastMove = ({ moves }) => getMove({ moves }, moves.length - 1);

export const getNextMoveColor = ({ moves }) => {
  if (moves.length === 0) return Color.RED;
  const { piece: lastMovedPiece } = moves[moves.length - 1];
  return utils.isRed(lastMovedPiece) ? Color.BLACK : Color.RED;
};

const lookupPlayer = (players, key, value) => players
  .find((p) => p[key] === value);

export const getNextMovePlayer = ({ players, moves }) => lookupPlayer(
  players, 'color', getNextMoveColor({ moves }),
);

export const getUserPlayer = ({ players }, username) => lookupPlayer(
  players, 'name', username,
);

export const getRedPlayer = ({ players }) => lookupPlayer(
  players, 'color', Color.RED,
);

export const getBlackPlayer = ({ players }) => lookupPlayer(
  players, 'color', Color.BLACK,
);

export const getUserColor = ({ players }, username) => {
  try {
    return getUserPlayer({ players }, username).color;
  } catch (e) {
    if (e instanceof TypeError) return undefined;
    throw e;
  }
};

export const getOtherPlayer = ({ players }, username) => players
  .find((p) => p.name !== username);

export default {};
