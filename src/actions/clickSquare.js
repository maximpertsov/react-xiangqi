import get from 'lodash/get';

import actions from 'actions';
import animateMove from 'actions/animateMove';
import makeMove from 'actions/makeMove';
import { squaresToMove } from 'services/logic/square';
import { isOccupied, sameColor } from 'services/logic/fen';

const ANIMATION_DELAY = 150;

const selectedCanCapture = ({ selectedSquare, selectedMove, square }) => {
  if (selectedSquare === null) return false;
  if (!isOccupied(selectedMove.fen, selectedSquare)) return false;
  if (!isOccupied(selectedMove.fen, square)) return false;

  return !sameColor(selectedMove.fen, square, selectedSquare);
};

const legalFen = ({ legalMoves, move }) => get(legalMoves, move, false);

const handleMove = (dispatch, { bottomPlayerIsRed, legalMoves, move }) => {
  const fen = legalFen({ legalMoves, move });
  if (fen) {
    dispatch(animateMove({ bottomPlayerIsRed, move }));
    setTimeout(() => {
      dispatch(makeMove({ fen, move }));
      dispatch(actions.board.animationOffset.clear());
      dispatch(actions.board.selectedSquare.set(null));
    }, ANIMATION_DELAY);
  } else {
    dispatch(actions.board.selectedSquare.set(null));
  }
};

const clickSquare = ({
  bottomPlayerIsRed,
  legalMoves,
  square,
  selectedMove,
  selectedSquare,
}) => dispatch => {
  if (square === selectedSquare) {
    dispatch(actions.board.selectedSquare.set(null));
  } else if (
    isOccupied(selectedMove.fen, square) &&
    !selectedCanCapture(square)
  ) {
    dispatch(actions.board.selectedSquare.set(square));
  } else if (selectedSquare !== null) {
    handleMove(dispatch, {
      bottomPlayerIsRed,
      legalMoves,
      move: squaresToMove(selectedSquare, square),
    });
  } else {
    dispatch(actions.board.selectedSquare.set(null));
  }
};

export default clickSquare;
