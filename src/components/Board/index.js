import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearAnimationOffset,
  clearSelectedSlot,
  makeMove,
  setAnimationOffset,
  setSelectedSlot,
} from 'actions';
import { getBottomPlayerIsRed, getLegalMoves, getSelectedMove } from 'reducers';

import BoardView from './components/BoardView';

const ANIMATION_DELAY = 150;

const Board = () => {
  const dispatch = useDispatch();
  const bottomPlayerIsRed = useSelector(state => getBottomPlayerIsRed(state));
  const legalMoves = useSelector(state => getLegalMoves(state));
  const selectedSlot = useSelector(state => state.selectedSlot);
  const { board } = useSelector(state => getSelectedMove(state));

  useEffect(
    () => {
      dispatch(clearSelectedSlot());
    },
    // TODO: is it too expensive to check if the board changes?
    // Can I key on another prop update?
    [board, dispatch],
  );

  const selectedCanCapture = useCallback(
    square => {
      if (selectedSlot === null) return false;
      if (!board.isOccupied(selectedSlot)) return false;
      if (!board.isOccupied(square)) return false;
      return !board.sameColor(square, selectedSlot);
    },
    [board, selectedSlot],
  );

  const isLegalMove = useCallback(move => legalMoves.includes(move), [
    legalMoves,
  ]);

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
      if (square === selectedSlot) {
        dispatch(clearSelectedSlot());
      } else if (board.isOccupied(square) && !selectedCanCapture(square)) {
        dispatch(setSelectedSlot({ selectedSlot: square }));
      } else if (selectedSlot !== null) {
        handleMove(`${selectedSlot}${square}`);
      } else {
        dispatch(clearSelectedSlot());
      }
    },
    [board, dispatch, handleMove, selectedCanCapture, selectedSlot],
  );

  return <BoardView handleSquareClick={handleSquareClick} />;
};

export default Board;
