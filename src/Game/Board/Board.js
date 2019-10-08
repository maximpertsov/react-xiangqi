/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import Square from '../Square/Square';
import { boardPropType } from '../../logic';
import * as styles from '../../commonStyles';

import boardImg from './board-1000px.svg.png';

const STEP_TINY = '20px';
const STEP_SMALL = '30px';
const STEP_MEDIUM = '45px';
const STEP_LARGE = '60px';

const Board = ({
  board,
  handleLegalMove,
  legalMoves,
  nextMoveColor,
  reversed,
}) => {
  const [selectedSlot, setSelectedSlot] = useState(undefined);
  const [moveX, setMoveX] = useState(0);
  const [moveY, setMoveY] = useState(0);

  // NOTE: this is the synchronous version of useEffect. Using
  // this version prevents late selection clearing, but causes
  // move updates to take longer. Annoying in development but
  // seems to be faster enough on a production build.
  useLayoutEffect(
    () => { setSelectedSlot(undefined); },
    // TODO: is it too expensive to check if the board changes?
    // Can I key on another prop update?
    [board],
  );

  const getPieceCode = (slot) => board.getPiece(slot) || undefined;

  const selectedCanCapture = (slot) => {
    if (selectedSlot === undefined) return false;
    if (!board.isOccupied(selectedSlot)) return false;
    if (!board.isOccupied(slot)) return false;
    return !board.sameColor(slot, selectedSlot);
  };

  const isLegalMove = (fromSlot, toSlot) => (
    legalMoves[fromSlot].includes(toSlot)
  );

  const handleMove = async(fromSlot, toSlot) => {
    if (isLegalMove(fromSlot, toSlot)) {
      const [fromY, fromX] = board.getRankFile(fromSlot);
      const [toY, toX] = board.getRankFile(toSlot);
      setMoveX(toX - fromX);
      setMoveY(toY - fromY);
      setTimeout(() => {
        handleLegalMove({ board, fromSlot, toSlot });
        setMoveX(0);
        setMoveY(0);
      }, 150);
    } else {
      setSelectedSlot(undefined);
    }
  };

  const handleSquareClick = (slot) => (() => {
    if (slot === selectedSlot) {
      setSelectedSlot(undefined);
    } else if (board.isOccupied(slot) && !selectedCanCapture(slot)) {
      setSelectedSlot(slot);
    } else if (selectedSlot !== undefined) {
      handleMove(selectedSlot, slot);
    } else {
      setSelectedSlot(undefined);
    }
  });

  const getTargets = () => (
    selectedSlot === undefined ? [] : legalMoves[selectedSlot]
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
        moveX={moveX}
        moveY={moveY}
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
        ${styles.MEDIA_TINY} {
          grid-template-rows: repeat(10, ${STEP_TINY});
          grid-template-columns: repeat(9, ${STEP_TINY});
        }
        ${styles.MEDIA_SMALL} {
          grid-template-rows: repeat(10, ${STEP_SMALL});
          grid-template-columns: repeat(9, ${STEP_SMALL});
        }
        ${styles.MEDIA_MEDIUM} {
          grid-template-rows: repeat(10, ${STEP_MEDIUM});
          grid-template-columns: repeat(9, ${STEP_MEDIUM});
        }
        ${styles.MEDIA_LARGE} {
          grid-template-rows: repeat(10, ${STEP_LARGE});
          grid-template-columns: repeat(9, ${STEP_LARGE});
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
  legalMoves: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  nextMoveColor: PropTypes.string.isRequired,
  reversed: PropTypes.bool.isRequired,
};

export default Board;
