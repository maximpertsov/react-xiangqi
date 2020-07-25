import React, { createContext } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import { getIsMoving, getTargets } from 'reducers';
import { activeKing, getPiece, isOccupied } from 'services/logic/fen';
import { uciToSquares } from 'services/logic/square';

// Derived props

const getPieceCode = ({ move, square }) => {
  if (!move.fen) return;

  return getPiece(move.fen, square) || undefined;
};

const getIsOccupied = ({ move, square }) => {
  if (!move.fen) return false;

  return isOccupied(move.fen, square);
};

const getIsInLastMove = ({ move, square }) => {
  if (!move.uci) return false;

  return uciToSquares(move.uci).includes(square);
};

const getIsKingInCheck = ({ move, square }) => {
  if (!move.givesCheck) return false;

  return activeKing(move.fen) === square;
};

const getIsSelected = ({ isMoving, selectedSquare, square }) => {
  if (isMoving) return false;

  return selectedSquare === square;
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
    isInLastMove: getIsInLastMove({ move, square }),
    isKingInCheck: getIsKingInCheck({ move, square }),
    isSelected: getIsSelected({ isMoving, selectedSquare, square }),
    isTargeted: getIsTargeted({ isMoving, targets, square }),
    move,
    square,
  }),
);

// Context and Provider

export const SquareContext = createContext(null);

export const SquareProvider = ({ children, move, square }) => {
  const props = useSelector(
    state => mapStateToProps(state, { move, square }),
    isEqual,
  );

  return (
    <SquareContext.Provider value={props}>{children}</SquareContext.Provider>
  );
};

SquareProvider.propTypes = {
  children: PropTypes.node.isRequired,
  move: PropTypes.shape(),
  square: PropTypes.string.isRequired,
};

SquareProvider.defaultProps = {
  move: {},
};

export default {};
