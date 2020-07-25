import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import PropTypes from 'prop-types';

import { SquareContext } from 'contexts/SquareProvider';

import DropIndicator from './DropIndicator';
import KingInCheckIndicator from './KingInCheckIndicator';
import LastMoveIndicator from './LastMoveIndicator';
import Piece from './Piece';
import SelectionIndicator from './SelectionIndicator';
import SquareView from './SquareView';
import TargetIndicator from './TargetIndicator';

// TODO make handle square click an action?
const Square = ({ handleSquareClick }) => {
  const { isTargeted, square } = useContext(SquareContext);
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

  return (
    <SquareView handleClick={handleSquareClick(square)} ref={drop}>
      <Piece />
      <DropIndicator over={isOver} targeted={isTargeted} />
      <LastMoveIndicator />
      <KingInCheckIndicator />
      <SelectionIndicator />
      <TargetIndicator />
    </SquareView>
  );
};

Square.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
};

export default Square;
