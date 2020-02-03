import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearAnimationOffset,
  clearSelectedSlot,
  makeMove,
  setAnimationOffset,
  setSelectedSlot,
} from 'actions';
import { getBottomPlayerIsRed, getSelectedMove, getLegalMoves } from 'reducers';

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
    slot => {
      if (selectedSlot === null) return false;
      if (!board.isOccupied(selectedSlot)) return false;
      if (!board.isOccupied(slot)) return false;
      return !board.sameColor(slot, selectedSlot);
    },
    [board, selectedSlot],
  );

  const isLegalMove = useCallback(
    (fromSlot, toSlot) => legalMoves[fromSlot].includes(toSlot),
    [legalMoves],
  );

  const handleMove = useCallback(
    (fromSlot, toSlot) => {
      if (isLegalMove(fromSlot, toSlot)) {
        dispatch(setAnimationOffset({ bottomPlayerIsRed, fromSlot, toSlot }));
        setTimeout(() => {
          dispatch(makeMove({ fromSlot, toSlot, pending: true }));
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
    slot => () => {
      if (slot === selectedSlot) {
        dispatch(clearSelectedSlot());
      } else if (board.isOccupied(slot) && !selectedCanCapture(slot)) {
        dispatch(setSelectedSlot({ selectedSlot: slot }));
      } else if (selectedSlot !== null) {
        handleMove(selectedSlot, slot);
      } else {
        dispatch(clearSelectedSlot());
      }
    },
    [board, dispatch, handleMove, selectedCanCapture, selectedSlot],
  );

  return <BoardView handleSquareClick={handleSquareClick} />;
};

export default Board;
