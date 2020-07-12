import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import makeMove from 'actions/makeMove';
import actions from 'actions';
import animateMove from 'actions/animateMove';
import { getBottomPlayerIsRed, getLegalMoves } from 'reducers';
import { isOccupied, sameTeam } from 'services/logic/fen';
import { squaresToUci } from 'services/logic/square';

import BoardView from './components/BoardView';

const ANIMATION_DELAY = 150;

const mapStateToProps = createSelector(
  [state => state],

  state => ({
    bottomPlayerIsRed: getBottomPlayerIsRed(state),
    legalMoves: getLegalMoves(state),
    selectedFen: state.selectedFen,
    selectedSquare: state.selectedSquare,
  }),
);

const Board = () => {
  const dispatch = useDispatch();

  const {
    bottomPlayerIsRed,
    legalMoves,
    selectedFen,
    selectedSquare,
  } = useSelector(mapStateToProps, isEqual);

  useEffect(() => {
    dispatch(actions.board.selectedSquare.set(null));
  }, [dispatch, selectedFen]);

  const selectedCanCapture = square => {
    if (selectedSquare === null) return false;
    if (!isOccupied(selectedFen, selectedSquare)) return false;
    if (!isOccupied(selectedFen, square)) return false;

    return !sameTeam(selectedFen, square, selectedSquare);
  };

  const legalFen = uci => get(legalMoves, uci, false);

  const handleMove = uci => {
    const fen = legalFen(uci);
    if (fen) {
      dispatch(animateMove({ bottomPlayerIsRed, uci }));
      setTimeout(() => {
        dispatch(makeMove({ fen, uci }));
        dispatch(actions.board.animationOffset.clear());
        dispatch(actions.board.selectedSquare.set(null));
      }, ANIMATION_DELAY);
    } else {
      dispatch(actions.board.selectedSquare.set(null));
    }
  };

  const handleSquareClick = square => () => {
    if (square === selectedSquare) {
      dispatch(actions.board.selectedSquare.set(null));
    } else if (isOccupied(selectedFen, square) && !selectedCanCapture(square)) {
      dispatch(actions.board.selectedSquare.set(square));
    } else if (selectedSquare !== null) {
      handleMove(squaresToUci(selectedSquare, square));
    } else {
      dispatch(actions.board.selectedSquare.set(null));
    }
  };

  return (
    <DndProvider backend={Backend}>
      <BoardView handleSquareClick={handleSquareClick} />
    </DndProvider>
  );
};

export default Board;
