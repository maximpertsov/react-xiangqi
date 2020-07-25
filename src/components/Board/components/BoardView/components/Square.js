import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import { SquareContext } from 'contexts/SquareProvider';
import { getIsMoving, getTargets } from 'reducers';
import { isOccupied } from 'services/logic/fen';
import { uciToSquares } from 'services/logic/square';

import DropIndicator from './DropIndicator';
import KingInCheckIndicator from './KingInCheckIndicator';
import LastMoveIndicator from './LastMoveIndicator';
import Piece from './Piece';
import SelectionIndicator from './SelectionIndicator';
import SquareView from './SquareView';
import TargetIndicator from './TargetIndicator';

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
    isOccupied: getIsOccupied({ move, square }),
    isTargeted: getIsTargeted({ isMoving, targets, square }),
  }),
);

// TODO make handle square click an action?
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
  const { isOccupied, isTargeted } = useSelector(
    state => mapStateToProps(state, { move, square }),
    isEqual,
  );

  return (
    <SquareView handleClick={handleSquareClick(square)} ref={drop}>
      <Piece occupied={isOccupied} />
      <DropIndicator over={isOver} targeted={isTargeted} />
      <LastMoveIndicator />
      <KingInCheckIndicator />
      <SelectionIndicator />
      <TargetIndicator occupied={isOccupied} targeted={isTargeted} />
    </SquareView>
  );
};

Square.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
};

export default Square;
