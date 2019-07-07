import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Square from '../Square/Square';
import { getPiece } from '../Piece/Piece';
import { boardPropType } from '../../logic';
import { playerPropType } from '../../customPropTypes';

import boardImg from './board-1000px.svg.png';

const Wrapper = styled.div`
  background-image: url(${boardImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  display: grid;
  grid-template-rows: repeat(10, 60px);
  grid-template-columns: repeat(9, 60px);
  justify-content: center;
`;

const Board = ({
  activePlayer,
  board,
  handleLegalMove,
  handleSelect,
  legalMoves,
  reversed,
  selectedSlot,
}) => {
  const getPieceOn = (slot) => getPiece(board.getPiece(slot));

  const selectedCanCapture = (slot) => {
    if (selectedSlot === null) return false;
    if (!board.isOccupied(selectedSlot)) return false;
    if (!board.isOccupied(slot)) return false;
    return !board.sameColor(slot, selectedSlot);
  };

  const isLegalMove = (fromSlot, toSlot) => {
    const { color } = activePlayer;
    if (!board.isColor(color, fromSlot)) return false;
    return legalMoves[fromSlot].includes(toSlot);
  };

  const handleMove = (fromSlot, toSlot) => {
    if (isLegalMove(fromSlot, toSlot)) handleLegalMove(board, fromSlot, toSlot);
    handleSelect({ slot: null });
  };

  const handleSquareClick = ({ slot, isOccupied }) => {
    if (slot === selectedSlot) {
      handleSelect({ slot: null });
    } else if (isOccupied && !selectedCanCapture(slot)) {
      handleSelect({ slot });
    } else if (selectedSlot !== null) {
      handleMove(selectedSlot, slot);
    } else {
      handleSelect({ slot: null });
    }
  };

  const getTargets = () => (
    selectedSlot === null ? [] : legalMoves[selectedSlot]
  );

  const getInCheckSlot = () => {
    const { color } = activePlayer;
    return board.kingInCheck(color) ? board.findKingSlot(color) : undefined;
  };

  const getSlot = (b, i) => (reversed ? b.length - i - 1 : i);

  const renderSquares = () => board.board.map((_, i, b) => {
    const slot = getSlot(b, i);
    return (
      <Square
        key={slot}
        slot={slot}
        piece={getPieceOn(slot)}
        inCheckSlot={getInCheckSlot()}
        targets={getTargets()}
        handleSquareClick={handleSquareClick}
        selected={selectedSlot === slot}
      />
    );
  });

  return (
    <Wrapper className="Board">
      {renderSquares()}
    </Wrapper>
  );
};

Board.propTypes = {
  activePlayer: playerPropType.isRequired,
  board: boardPropType.isRequired,
  handleLegalMove: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  legalMoves: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  reversed: PropTypes.bool.isRequired,
  selectedSlot: PropTypes.number,
};

Board.defaultProps = {
  selectedSlot: null,
};

export default Board;
