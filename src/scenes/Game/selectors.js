import {
  getLastMove,
  getSelectedMove,
  getNextMoveColor,
  getUserColor,
} from 'reducers';

/********************/
/***  Game Logic  ***/
/********************/

// TODO break up function
export const getLegalMoves = (
  { gameSlug, moves, players, selectedMoveId, username },
) => {
  const nextMoveColor = getNextMoveColor({ moves });
  const userColor = getUserColor({ players, username });
  const { board } = getSelectedMove({ moves, selectedMoveId });
  const currentUserOnly = gameSlug !== null;
  const lastMoveId = getLastMove({ moves }).id;

  return board
    .legalMoves()
    .map((toSlots, fromSlot) => {
      if (selectedMoveId !== lastMoveId) return [];
      if (!board.isColor(nextMoveColor, fromSlot)) return [];
      if (currentUserOnly && !board.isColor(userColor, fromSlot)) return [];
      return toSlots;
    });
};

// TODO: this isn't really a selector -- use refactor with mapStateToProps
export const hasLegalMoves = state => {
  const { board } = getLastMove(state);
  return board.hasLegalMoves(getNextMoveColor(state));
};

export default {};
