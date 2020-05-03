import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import { activeKing, getPiece, isOccupied } from 'services/logic/fen';
import { moveToSquares } from 'services/logic/square';

import { getIsMoving, getSelectedMove, getTargets } from 'reducers';

import SquareView from './SquareView';
import Piece from './Piece';

import DropIndicator from './DropIndicator';
import LastMoveIndicator from './LastMoveIndicator';
import KingInCheckIndicator from './KingInCheckIndicator';
import SelectionIndicator from './SelectionIndicator';
import TargetIndicator from './TargetIndicator';

const getPieceCode = (selectedMove, square) =>
  getPiece(selectedMove.fen, square) || undefined;

const getIsOccupied = (selectedMove, square) =>
  isOccupied(selectedMove.fen, square);

const getIsInLastMove = (selectedMove, square) => {
  if (selectedMove.move === null) return false;

  return moveToSquares(selectedMove.move).includes(square);
};

const getIsKingInCheck = (selectedMove, square) => {
  if (!selectedMove.givesCheck) return false;

  return activeKing(selectedMove.fen) === square;
};

const getSelectedMoveSquareDetails = createSelector(
  state => getSelectedMove(state),
  (_, square) => square,

  (selectedMove, square) => ({
    pieceCode: getPieceCode(selectedMove, square),
    isOccupied: getIsOccupied(selectedMove, square),
    isInLastMove: getIsInLastMove(selectedMove, square),
    isKingInCheck: getIsKingInCheck(selectedMove, square),
  }),
);

const getIsSelected = createSelector(
  state => getIsMoving(state),
  state => state.selectedSquare,
  (_, square) => square,

  (isMoving, selectedSquare, square) => {
    if (isMoving) return false;

    return selectedSquare === square;
  },
);

const getIsTargeted = createSelector(
  state => getIsMoving(state),
  state => getTargets(state),
  (_, square) => square,

  (isMoving, targets, square) => {
    if (isMoving) return false;

    // TODO: remove index access?
    return targets.some(move => moveToSquares(move)[1] === square);
  },
);

// TODO make handle square click an action?
// eslint-disable-next-line complexity
const Square = ({ handleSquareClick, square }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'PIECE',
    drop: () => {
      handleSquareClick(square)();
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const [moveX, moveY] = useSelector(state => state.animationOffset, isEqual);
  const selectedSquare = useSelector(state => state.selectedSquare);

  // Component selectors
  const { pieceCode, isOccupied, isInLastMove, isKingInCheck } = useSelector(
    state => getSelectedMoveSquareDetails(state, square),
    isEqual,
  );
  const isSelected = useSelector(state => getIsSelected(state, square));
  const isTargeted = useSelector(state => getIsTargeted(state, square));

  const renderTargetIndicator = useCallback(
    () => <TargetIndicator occupied={isOccupied} />,
    [isOccupied],
  );

  const renderPiece = useCallback(
    () => (
      <Piece
        code={pieceCode}
        moveX={selectedSquare === square ? moveX : 0}
        moveY={selectedSquare === square ? moveY : 0}
        square={square}
      />
    ),
    [moveX, moveY, pieceCode, selectedSquare, square],
  );

  return (
    <SquareView handleClick={handleSquareClick(square)} ref={drop}>
      {isOccupied && renderPiece()}
      {isOver && isTargeted && <DropIndicator />}
      {isInLastMove && <LastMoveIndicator />}
      {isKingInCheck && <KingInCheckIndicator />}
      {isSelected && <SelectionIndicator />}
      {isTargeted && renderTargetIndicator()}
    </SquareView>
  );
};

Square.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
  square: PropTypes.string.isRequired,
};

export default Square;
