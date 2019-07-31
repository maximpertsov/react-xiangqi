// Select a move by idx, where -1 is the latest move
// Return an empty object if move lookup fails
export const getMove = (state, idx) => state.moves[idx];

export const getNextMoveColor = (moves) => {
  if (moves.length === 0) return 'red';

  // TODO: we don't really need a specific board for this function
  const { piece: lastMovedPiece, board } = moves[moves.length - 1];

  return board.isRedCode(lastMovedPiece) ? 'black' : 'red';
};


// TODO: create PlayerManager class?
export const getNextMovePlayer = (players, moves) => {
  const nextMoveColor = getNextMoveColor(moves);
  return players.find((p) => p.color === nextMoveColor);
};


export default {};
