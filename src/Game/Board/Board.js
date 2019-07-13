import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Square from '../Square/Square';
import { getPiece } from '../Piece/Piece';
import { boardPropType } from '../../logic';
import { GameContext } from '../GameProvider';

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
  board,
  handleLegalMove,
  handleSelect,
  legalMoves,
  nextMoveColor,
  reversed,
  selectedSlot,
}, context) => {
  const getPieceOn = (slot) => getPiece(board.getPiece(slot));

  const selectedCanCapture = (slot) => {
    if (selectedSlot === null) return false;
    if (!board.isOccupied(selectedSlot)) return false;
    if (!board.isOccupied(slot)) return false;
    return !board.sameColor(slot, selectedSlot);
  };

  const isLegalMove = (fromSlot, toSlot) => (
    legalMoves[fromSlot].includes(toSlot)
  );

  const handleMove = (fromSlot, toSlot) => {
    if (isLegalMove(fromSlot, toSlot)) handleLegalMove(board, fromSlot, toSlot);
    context.selectSquare({ slot: null });
  };

  const handleSquareClick = ({ slot, isOccupied }) => {
    if (slot === selectedSlot) {
      context.selectSquare({ slot: null });
    } else if (isOccupied && !selectedCanCapture(slot)) {
      context.selectSquare({ slot });
    } else if (selectedSlot !== null) {
      handleMove(selectedSlot, slot);
    } else {
      context.selectSquare({ slot: null });
    }
  };

  const getTargets = () => (
    selectedSlot === null ? [] : legalMoves[selectedSlot]
  );

  const getInCheckSlot = () => {
    if (!board.kingInCheck(nextMoveColor)) return undefined;
    return board.findKingSlot(nextMoveColor);
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
  board: boardPropType.isRequired,
  handleLegalMove: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  legalMoves: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  nextMoveColor: PropTypes.string.isRequired,
  reversed: PropTypes.bool.isRequired,
  selectedSlot: PropTypes.number,
};

Board.defaultProps = {
  selectedSlot: null,
};

Board.contextType = GameContext;

export default Board;
