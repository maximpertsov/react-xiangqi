// Select a move by idx, where -1 is the latest move
// Return an empty object if move lookup fails
export const getMove = ({ moves }, idx) => moves[idx];

export const getNextMoveColor = ({ moves }) => {
  if (moves.length === 0) return 'red';

  // TODO: we don't really need a specific board for this function
  const { piece: lastMovedPiece, board } = moves[moves.length - 1];

  return board.isRedCode(lastMovedPiece) ? 'black' : 'red';
};

const lookupPlayer = (players, key, value) => players
  .find((p) => p[key] === value);

const lookupPlayerAttribute = (players, key, value, attribute, errorFn) => {
  try {
    return lookupPlayer(players, key, value)[attribute];
  } catch (e) {
    if (e instanceof TypeError) return errorFn();
    throw e;
  }
};

export const getNextMovePlayer = ({ players, moves }) => lookupPlayer(
  players, 'color', getNextMoveColor({ moves }),
);

export const getUserPlayer = ({ players }, username) => lookupPlayer(
  players, 'name', username,
);

export const getUserColor = ({ players }, username) => (
  lookupPlayerAttribute(
    players,
    'name',
    username,
    'color',
    () => undefined,
  )
);

export default {};
