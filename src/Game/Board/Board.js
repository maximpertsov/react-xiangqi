/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';
import Square from '../Square/Square';
import { boardPropType } from '../../logic';

import boardImg from './board-1000px.svg.png';

const Board = ({
  board,
  handleLegalMove,
  handleSelect,
  legalMoves,
  nextMoveColor,
  reversed,
  selectedSlot,
}) => {
  const getPieceCode = (slot) => board.getPiece(slot) || undefined;

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
    handleSelect({ slot: null });
  };

  const handleSquareClick = (slot) => (() => {
    if (slot === selectedSlot) {
      handleSelect({ slot: null });
    } else if (board.isOccupied(slot) && !selectedCanCapture(slot)) {
      handleSelect({ slot });
    } else if (selectedSlot !== null) {
      handleMove(selectedSlot, slot);
    } else {
      handleSelect({ slot: null });
    }
  });

  const getTargets = () => (
    selectedSlot === null ? [] : legalMoves[selectedSlot]
  );

  const inCheck = (slot) => {
    if (!board.kingInCheck(nextMoveColor)) return false;
    return board.findKingSlot(nextMoveColor) === slot;
  };

  const getSlot = (b, i) => (reversed ? b.length - i - 1 : i);

  const renderSquares = () => board.board.map((_, i, b) => {
    const slot = getSlot(b, i);
    return (
      <Square
        key={slot}
        handleClick={handleSquareClick(slot)}
        inCheck={inCheck(slot)}
        pieceCode={getPieceCode(slot)}
        selected={selectedSlot === slot}
        targeted={getTargets().includes(slot)}
      />
    );
  });

  return (
    <div
      className="Board"
      css={css`
        background-image: url(${boardImg});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: top;
        display: grid;
        @media (max-width: 360px) {
          grid-template-rows: repeat(10, 20px);
          grid-template-columns: repeat(9, 20px);
        }
        @media (min-width: 360px) and (max-width: 540px) {
          grid-template-rows: repeat(10, 30px);
          grid-template-columns: repeat(9, 30px);
        }
        @media (min-width: 540px) and (max-width: 720px) {
          grid-template-rows: repeat(10, 45px);
          grid-template-columns: repeat(9, 45px);
        }
        @media (min-width: 720px) {
          grid-template-rows: repeat(10, 60px);
          grid-template-columns: repeat(9, 60px);
        }
      `}
    >
      {renderSquares()}
    </div>
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

export default Board;
