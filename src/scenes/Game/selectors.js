import sortedIndexBy from 'lodash/sortedIndexBy';

import { Color } from 'services/logic/constants';
import { isRed } from 'services/logic/utils';

/***************/
/***  Moves  ***/
/***************/

export const getFirstMove = ({ moves }) =>
  moves[0];

export const getLastMove = ({ moves }) =>
  moves[moves.length - 1];

export const getMoveIndex = ({ moves }, moveId ) => {
  const moveIndex = sortedIndexBy(moves, { id: moveId }, 'id');
  if (moves[moveIndex].id === moveId) return moveIndex;
  return -1;
};

// TODO: duplicate logic in actions.js
export const getSelectedMove = ({ moves, selectedMoveId }) =>
  moves[getMoveIndex({ moves }, selectedMoveId)];

export const getNextMoveColor = ({ moves }) => {
  if (moves.length === 0) return Color.RED;

  const { piece } = getLastMove({ moves });
  return isRed(piece) ? Color.BLACK : Color.RED;
};

/*****************/
/***  Players  ***/
/*****************/

const lookupPlayer = (players, key, value) =>
  players.find((p) => p[key] === value);

export const getNextMovePlayer = ({ players, moves }) =>
  lookupPlayer(players, 'color', getNextMoveColor({ moves }));

const getUserPlayer = ({ players }, { username }) =>
  lookupPlayer(players, 'name', username);

export const getRedPlayer = ({ players }) =>
  lookupPlayer(players, 'color', Color.RED);

export const getBlackPlayer = ({ players }) =>
  lookupPlayer(players, 'color', Color.BLACK);

export const getUserColor = ({ players }, { username }) => {
  try {
    return getUserPlayer({ players }, { username }).color;
  } catch (e) {
    if (e instanceof TypeError) return undefined;
    throw e;
  }
};

export const getOtherPlayer = ({ players }, { gameSlug, username }) => {
  if (gameSlug === undefined) getBlackPlayer({ players });
  return players.find((p) => p.name !== username);
};

// TODO: add a state that allows players to flip their original orientation
export const getInitialUserOrientation = ({ players }, { username }) =>
  getUserColor({ players }, { username }) === Color.BLACK;

// TODO: move to layout class that displays board and players
export const getCurrentPlayer = ({ players }, { gameSlug, username }) => {
  if (gameSlug === undefined) getRedPlayer({ players });
  return getUserPlayer({ players }, { username });
};

/********************/
/***  Game Logic  ***/
/********************/

// TODO break up function
export const getLegalMoves = (
  { moves, players, selectedMoveId },
  { gameSlug, username },
) => {
  const nextMoveColor = getNextMoveColor({ moves });
  const userColor = getUserColor({ players }, { username });
  const { board } = getSelectedMove({ moves, selectedMoveId });
  const currentUserOnly = gameSlug !== undefined;
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
export const hasLegalMoves = (state) => {
  const { board } = getLastMove(state);
  return board.hasLegalMoves(getNextMoveColor(state));
};

export default {};
