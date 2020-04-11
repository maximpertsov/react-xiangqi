import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import has from 'lodash/has';

import {
  clearAnimationOffset,
  clearSelectedSlot,
  makeMove,
  setAnimationOffset,
  setSelectedSlot,
} from 'actions';
import {
  getBottomPlayerIsRed,
  getLegalMoves,
  getSelectedBoard,
} from 'reducers';
import { squaresToMove } from 'services/logic/square';

import BoardView from './components/BoardView';

const ANIMATION_DELAY = 150;

const Board = () => {
  const dispatch = useDispatch();

  const bottomPlayerIsRed = useSelector(state => getBottomPlayerIsRed(state));
  const board = useSelector(state => getSelectedBoard(state));
  const legalMoves = useSelector(state => getLegalMoves(state));
  const selectedSquare = useSelector(state => state.selectedSquare);

  useEffect(
    () => {
      dispatch(clearSelectedSlot());
    },
    // TODO: is it too expensive to check if the board changes?
    // Can I key on another prop update?
    [dispatch],
  );

  const selectedCanCapture = useCallback(
    square => {
      if (selectedSquare === null) return false;
      if (!board.isOccupied(selectedSquare)) return false;
      if (!board.isOccupied(square)) return false;
      return !board.sameColor(square, selectedSquare);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSquare],
  );

  const isLegalMove = useCallback(move => has(legalMoves, move), [legalMoves]);

  const handleMove = useCallback(
    move => {
      if (isLegalMove(move)) {
        dispatch(setAnimationOffset({ bottomPlayerIsRed, move }));
        setTimeout(() => {
          dispatch(makeMove({ move, pending: true }));
          dispatch(clearAnimationOffset());
          dispatch(clearSelectedSlot());
        }, ANIMATION_DELAY);
      } else {
        dispatch(clearSelectedSlot());
      }
    },
    [bottomPlayerIsRed, dispatch, isLegalMove],
  );

  const handleSquareClick = useCallback(
    square => () => {
      if (square === selectedSquare) {
        dispatch(clearSelectedSlot());
      } else if (board.isOccupied(square) && !selectedCanCapture(square)) {
        dispatch(setSelectedSlot({ selectedSquare: square }));
      } else if (selectedSquare !== null) {
        handleMove(squaresToMove(selectedSquare, square));
      } else {
        dispatch(clearSelectedSlot());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, handleMove, selectedCanCapture, selectedSquare],
  );

  return <BoardView handleSquareClick={handleSquareClick} />;
};

export default Board;
