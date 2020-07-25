import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import { SquareContext } from 'contexts/SquareProvider';
import { getIsMoving, getTargets } from 'reducers';
import { getPiece, isOccupied } from 'services/logic/fen';
import { uciToSquares } from 'services/logic/square';

import DropIndicator from './DropIndicator';
import KingInCheckIndicator from './KingInCheckIndicator';
import LastMoveIndicator from './LastMoveIndicator';
import Piece from './Piece';
import SelectionIndicator from './SelectionIndicator';
import SquareView from './SquareView';
import TargetIndicator from './TargetIndicator';

const getPieceCode = ({ move, square }) => {
  if (!move.fen) return;

  return getPiece(move.fen, square) || undefined;
};

const getIsOccupied = ({ move, square }) => {
  if (!move.fen) return false;

  return isOccupied(move.fen, square);
};

const getIsTargeted = ({ isMoving, targets, square }) => {
  if (isMoving) return false;

  // TODO: remove index access?
  return targets.some(uci => uciToSquares(uci)[1] === square);
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
  state => state.selectedSquare,
  state => getTargets(state),
  (_, props) => props.square,
  (_, props) => props.move,

  (animationOffset, isMoving, selectedSquare, targets, square, move) => ({
    ...getAnimationOffset({ animationOffset, selectedSquare, square }),
    pieceCode: getPieceCode({ move, square }),
    isOccupied: getIsOccupied({ move, square }),
    isTargeted: getIsTargeted({ isMoving, targets, square }),
  }),
);

// TODO make handle square click an action?
// eslint-disable-next-line complexity
const Square = ({ handleSquareClick }) => {
  const { move, square } = useContext(SquareContext);
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
  const { moveX, moveY, pieceCode, isOccupied, isTargeted } = useSelector(
    state => mapStateToProps(state, { move, square }),
    isEqual,
  );

  const renderTargetIndicator = () => <TargetIndicator occupied={isOccupied} />;

  const renderPiece = () => (
    <Piece code={pieceCode} moveX={moveX} moveY={moveY} square={square} />
  );

  return (
    <SquareView handleClick={handleSquareClick(square)} ref={drop}>
      {isOccupied && renderPiece()}
      <DropIndicator isOver={isOver} isTargeted={isTargeted} />
      <LastMoveIndicator />
      <KingInCheckIndicator />
      <SelectionIndicator />
      {isTargeted && renderTargetIndicator()}
    </SquareView>
  );
};

Square.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
};

export default Square;
