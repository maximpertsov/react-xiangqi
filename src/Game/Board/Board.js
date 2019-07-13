/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';
import Square from '../Square/Square';
import XiangqiPiece from '../Piece/Piece';
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
  const getPieceOn = (slot) => {
    const code = board.getPiece(slot);

    if (code === null) return undefined;
    return <XiangqiPiece code={code} />;
  };

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

  const handleSquareClick = (slot) => {
    if (slot === selectedSlot) {
      handleSelect({ slot: null });
    } else if (board.isOccupied(slot) && !selectedCanCapture(slot)) {
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
        targeted={getTargets().includes(slot)}
        handleSquareClick={handleSquareClick}
        selected={selectedSlot === slot}
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
        grid-template-rows: repeat(10, 60px);
        grid-template-columns: repeat(9, 60px);
        justify-content: center;
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
