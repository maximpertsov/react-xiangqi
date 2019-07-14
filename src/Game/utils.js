// Select a move by idx, where -1 is the latest move
// Return an empty object if move lookup fails
export const selectMove = (moves, idx) => (
  moves[idx === -1 ? moves.length - 1 : idx] || {}
);

export default {};
