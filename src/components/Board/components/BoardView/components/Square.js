import React from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';

import SquareView from './SquareView';

// const Wrapper = styled.div`
//   background-color: ${props =>
//     props.isOver ? 'rgba(255, 255, 153, 0.7)' : 'none'};
//   border-radius: 50%;
//   display: flex;
//   justify-content: center;
//   margin: 0px;
//   padding: 0px;
//   position: relative;
// `;

const Square = ({ children, handleClick, square }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'PIECE',
    drop: () => true,
    canDrop: () => true,
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <SquareView
      handleClick={handleSquareClick(square)}
      ref={drop}
      isOver={isOver}
    >
      {isOccupied(square) && renderPiece(square)}
      {inLastMove(square) && <LastMoveIndicator />}
      {kingIsInCheck(square) && <KingInCheckIndicator />}
      {isSelected(square) && <SelectionIndicator />}
      {isTargeted(square) && renderTargetIndicator(square)}
    </SquareView>
  );
};

Square.propTypes = {
  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
  square: PropTypes.string.isRequired,
};

export default Square;
