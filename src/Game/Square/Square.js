import React from 'react';
import PropTypes from 'prop-types';
import EmptySquare from './EmptySquare';
import SquareWithPiece from './SquareWithPiece';


const Square = ({
  handleSquareClick,
  pieceCode,
  slot,
  selected,
  inCheckSlot,
  targeted,
}) => {
  const isOccupied = () => pieceCode !== undefined;

  const handleClick = () => {
    handleSquareClick(slot);
  };


  if (!isOccupied()) {
    return <EmptySquare handleClick={handleClick} targeted={targeted} />;
  }

  return (
    <SquareWithPiece
      handleClick={handleClick}
      pieceCode={pieceCode}
      slot={slot}
      selected={selected}
      inCheckSlot={inCheckSlot}
      targeted={targeted}
    />
  );
};

Square.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
  pieceCode: PropTypes.string,
  slot: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  inCheckSlot: PropTypes.number,
  targeted: PropTypes.bool.isRequired,
};

Square.defaultProps = {
  pieceCode: undefined,
  inCheckSlot: null,
};

export default Square;
