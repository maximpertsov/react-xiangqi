import React, { useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import makeMove from 'actions/makeMove';
import actions from 'actions';
import animateMove from 'actions/animateMove';
import { getBottomPlayerIsRed, getLegalMoves } from 'reducers';
import { isOccupied, sameColor } from 'services/logic/fen';
import { squaresToUci } from 'services/logic/square';

import BoardView from './components/BoardView';

const ANIMATION_DELAY = 150;

const Board = () => {
  const dispatch = useDispatch();

  const bottomPlayerIsRed = useSelector(state => getBottomPlayerIsRed(state));
  const legalMoves = useSelector(state => getLegalMoves(state), isEqual);
  const selectedFen = useSelector(state => state.selectedFen);
  const selectedSquare = useSelector(state => state.selectedSquare);

  useEffect(() => {
    dispatch(actions.board.selectedSquare.set(null));
  }, [dispatch, selectedFen]);

  const selectedCanCapture = useCallback(
    square => {
      if (selectedSquare === null) return false;
      if (!isOccupied(selectedFen, selectedSquare)) return false;
      if (!isOccupied(selectedFen, square)) return false;

      return !sameColor(selectedFen, square, selectedSquare);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFen, selectedSquare],
  );

  const legalFen = useCallback(
    uci => get(legalMoves, uci, false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFen, selectedSquare],
  );

  const handleMove = useCallback(
    uci => {
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
    },
    [bottomPlayerIsRed, dispatch, legalFen],
  );

  const handleSquareClick = useCallback(
    square => () => {
      if (square === selectedSquare) {
        dispatch(actions.board.selectedSquare.set(null));
      } else if (
        isOccupied(selectedFen, square) &&
        !selectedCanCapture(square)
      ) {
        dispatch(actions.board.selectedSquare.set(square));
      } else if (selectedSquare !== null) {
        handleMove(squaresToUci(selectedSquare, square));
      } else {
        dispatch(actions.board.selectedSquare.set(null));
      }
    },
    [dispatch, handleMove, selectedCanCapture, selectedFen, selectedSquare],
  );

  return (
    <DndProvider backend={Backend}>
      <BoardView handleSquareClick={handleSquareClick} />
    </DndProvider>
  );
};

export default Board;
