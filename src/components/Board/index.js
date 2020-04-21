import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import {
  clearAnimationOffset,
  clearSelectedSlot,
  makeMove,
  setAnimationOffset,
  setSelectedSlot,
} from 'actions';
import { getBottomPlayerIsRed, getLegalMoves, getSelectedMove } from 'reducers';
import { isOccupied, sameColor } from 'services/logic/fen';
import { squaresToMove } from 'services/logic/square';

import BoardView from './components/BoardView';

const ANIMATION_DELAY = 150;

const Board = () => {
  const dispatch = useDispatch();

  const bottomPlayerIsRed = useSelector(state => getBottomPlayerIsRed(state));
  const legalMoves = useSelector(state => getLegalMoves(state), isEqual);
  const selectedMove = useSelector(state => getSelectedMove(state), isEqual);
  const selectedSquare = useSelector(state => state.selectedSquare);

  useEffect(() => {
    dispatch(clearSelectedSlot());
  }, [dispatch, selectedMove.fen]);

  const selectedCanCapture = useCallback(
    square => {
      if (selectedSquare === null) return false;
      if (!isOccupied(selectedMove.fen, selectedSquare)) return false;
      if (!isOccupied(selectedMove.fen, square)) return false;

      return !sameColor(selectedMove.fen, square, selectedSquare);
    },
    [selectedMove.fen, selectedSquare],
  );

  const legalFen = useCallback(
    move => get(legalMoves, move, false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedMove.fen, selectedSquare],
  );

  const handleMove = useCallback(
    move => {
      const fen = legalFen(move);
      if (fen) {
        dispatch(setAnimationOffset({ bottomPlayerIsRed, move }));
        setTimeout(() => {
          dispatch(makeMove({ fen, move, pending: true }));
          dispatch(clearAnimationOffset());
          dispatch(clearSelectedSlot());
        }, ANIMATION_DELAY);
      } else {
        dispatch(clearSelectedSlot());
      }
    },
    [bottomPlayerIsRed, dispatch, legalFen],
  );

  const handleSquareClick = useCallback(
    square => () => {
      if (square === selectedSquare) {
        dispatch(clearSelectedSlot());
      } else if (
        isOccupied(selectedMove.fen, square) &&
        !selectedCanCapture(square)
      ) {
        dispatch(setSelectedSlot({ selectedSquare: square }));
      } else if (selectedSquare !== null) {
        handleMove(squaresToMove(selectedSquare, square));
      } else {
        dispatch(clearSelectedSlot());
      }
    },
    [
      dispatch,
      handleMove,
      selectedCanCapture,
      selectedMove.fen,
      selectedSquare,
    ],
  );

  return <BoardView handleSquareClick={handleSquareClick} />;
};

export default Board;
