import React, { createContext } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import { getIsMoving, getTargets } from 'reducers';
import { isOccupied } from 'services/logic/fen';
import { uciToSquares } from 'services/logic/square';

// Derived props

const getIsOccupied = ({ move, square }) => {
  if (!move.fen) return false;

  return isOccupied(move.fen, square);
};

const getIsTargeted = ({ isMoving, targets, square }) => {
  if (isMoving) return false;

  // TODO: remove index access?
  return targets.some(uci => uciToSquares(uci)[1] === square);
};

const mapStateToProps = createSelector(
  state => getIsMoving(state),
  state => getTargets(state),
  (_, props) => props.square,
  (_, props) => props.move,

  (isMoving, targets, square, move) => ({
    square,
    move,
    isOccupied: getIsOccupied({ move, square }),
    isTargeted: getIsTargeted({ isMoving, targets, square }),
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
