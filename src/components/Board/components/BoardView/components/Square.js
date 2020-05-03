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

const getPieceCode = ({ selectedMove, square }) =>
  getPiece(selectedMove.fen, square) || undefined;

const getIsOccupied = ({ selectedMove, square }) =>
  isOccupied(selectedMove.fen, square);

const getIsInLastMove = ({ selectedMove, square }) => {
  if (selectedMove.move === null) return false;

  return moveToSquares(selectedMove.move).includes(square);
};

const getIsKingInCheck = ({ selectedMove, square }) => {
  if (!selectedMove.givesCheck) return false;

  return activeKing(selectedMove.fen) === square;
};

const getIsSelected = ({ isMoving, selectedSquare, square }) => {
  if (isMoving) return false;

  return selectedSquare === square;
};

const getIsTargeted = ({ isMoving, targets, square }) => {
  if (isMoving) return false;

  // TODO: remove index access?
  return targets.some(move => moveToSquares(move)[1] === square);
};

const getAnimationOffset = ({ animationOffset, selectedSquare, square }) => {
  const [offsetX, offsetY] = animationOffset;

  return {
    moveX: selectedSquare === square ? offsetX : 0,
    moveY: selectedSquare === square ? offsetY : 0,
  };
};

const mapStateToProps = createSelector(
  state => state.animationOffset,
  state => getIsMoving(state),
  state => getSelectedMove(state),
  state => state.selectedSquare,
  state => getTargets(state),
  (_, square) => square,

  (
    animationOffset,
    isMoving,
    selectedMove,
    selectedSquare,
    targets,
    square,
  ) => ({
    ...getAnimationOffset({ animationOffset, selectedSquare, square }),
    pieceCode: getPieceCode({ selectedMove, square }),
    isOccupied: getIsOccupied({ selectedMove, square }),
    isInLastMove: getIsInLastMove({ selectedMove, square }),
    isKingInCheck: getIsKingInCheck({ selectedMove, square }),
    isSelected: getIsSelected({ isMoving, selectedSquare, square }),
    isTargeted: getIsTargeted({ isMoving, targets, square }),
  }),
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

  // Component selectors
  const {
    moveX,
    moveY,
    pieceCode,
    isOccupied,
    isInLastMove,
    isKingInCheck,
    isSelected,
    isTargeted,
  } = useSelector(state => mapStateToProps(state, square), isEqual);

  const renderTargetIndicator = useCallback(
    () => <TargetIndicator occupied={isOccupied} />,
    [isOccupied],
  );

  const renderPiece = useCallback(
    () => (
      <Piece code={pieceCode} moveX={moveX} moveY={moveY} square={square} />
    ),
    [moveX, moveY, pieceCode, square],
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
