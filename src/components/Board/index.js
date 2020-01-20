import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';

import * as logic from 'services/logic';
import * as styles from 'commonStyles';

import Square from './components/Square';

import boardImg from './board-1000px.svg.png';

const Wrapper = styled.div`
background-image: url(${boardImg});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
display: grid;
${styles.MEDIA_TINY} {
  grid-template-rows: repeat(10, ${styles.SQUARE_SIZE_TINY});
  grid-template-columns: repeat(9, ${styles.SQUARE_SIZE_TINY});
}
${styles.MEDIA_SMALL} {
  grid-template-rows: repeat(10, ${styles.SQUARE_SIZE_SMALL});
  grid-template-columns: repeat(9, ${styles.SQUARE_SIZE_SMALL});
}
${styles.MEDIA_MEDIUM} {
  grid-template-rows: repeat(10, ${styles.SQUARE_SIZE_MEDIUM});
  grid-template-columns: repeat(9, ${styles.SQUARE_SIZE_MEDIUM});
}
${styles.MEDIA_LARGE} {
  grid-template-rows: repeat(10, ${styles.SQUARE_SIZE_LARGE});
  grid-template-columns: repeat(9, ${styles.SQUARE_SIZE_LARGE});
}
`;

const ANIMATION_DELAY = 150;

const Board = ({
  board,
  handleLegalMove,
  lastMove,
  legalMoves,
  nextMoveColor,
  reversed,
}) => {
  const dispatch = useDispatch();
  const selectedSlot = useSelector(state => state.selectedSlot);

  // TODO: use key frame animation instead of state?
  const [moveX, setMoveX] = useState(0);
  const [moveY, setMoveY] = useState(0);

  // NOTE: this is the synchronous version of useEffect. Using
  // this version prevents late selection clearing, but causes
  // move updates to take longer. Annoying in development but
  // seems to be fast enough on a production build.
  useLayoutEffect(
    () => {
      dispatch({ type: 'set_selected_slot', selectedSlot: null });
    },
    // TODO: is it too expensive to check if the board changes?
    // Can I key on another prop update?
    [board, dispatch],
  );

  const getPieceCode = slot => board.getPiece(slot) || undefined;

  const selectedCanCapture = slot => {
    if (selectedSlot === null) return false;
    if (!board.isOccupied(selectedSlot)) return false;
    if (!board.isOccupied(slot)) return false;
    return !board.sameColor(slot, selectedSlot);
  };

  const isLegalMove = (fromSlot, toSlot) =>
    legalMoves[fromSlot].includes(toSlot);

  const handleMove = (fromSlot, toSlot) => {
    if (isLegalMove(fromSlot, toSlot)) {
      const [fromY, fromX] = logic.getRankFile(fromSlot);
      const [toY, toX] = logic.getRankFile(toSlot);
      setMoveX(reversed ? fromX - toX : toX - fromX);
      setMoveY(reversed ? fromY - toY : toY - fromY);
      setTimeout(() => {
        handleLegalMove({ fromSlot, toSlot });
        setMoveX(0);
        setMoveY(0);
        dispatch({ type: 'set_selected_slot', selectedSlot: null });
      }, ANIMATION_DELAY);
    } else {
      dispatch({ type: 'set_selected_slot', selectedSlot: null });
    }
  };

  const handleSquareClick = slot => () => {
    if (slot === selectedSlot) {
      dispatch({ type: 'set_selected_slot', selectedSlot: null });
    } else if (board.isOccupied(slot) && !selectedCanCapture(slot)) {
      dispatch({ type: 'set_selected_slot', selectedSlot: slot });
    } else if (selectedSlot !== null) {
      handleMove(selectedSlot, slot);
    } else {
      dispatch({ type: 'set_selected_slot', selectedSlot: null });
    }
  };

  const getTargets = () =>
    selectedSlot === null ? [] : legalMoves[selectedSlot];

  const inCheck = slot => {
    if (!board.kingInCheck(nextMoveColor)) return false;
    return board.findKingSlot(nextMoveColor) === slot;
  };

  const getSlot = (b, i) => (reversed ? b.length - i - 1 : i);

  const renderSquares = () =>
    board.board.map((_, i, b) => {
      const slot = getSlot(b, i);
      // TODO: use classNames to capture multiple styles
      return (
        <Square
          key={slot}
          handleClick={handleSquareClick(slot)}
          inCheck={inCheck(slot)}
          inLastMove={slot === lastMove.fromSlot || slot === lastMove.toSlot}
          pieceCode={getPieceCode(slot)}
          selected={selectedSlot === slot}
          targeted={getTargets().includes(slot)}
          moveX={moveX}
          moveY={moveY}
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
  board: logic.boardPropType.isRequired,
  handleLegalMove: PropTypes.func.isRequired,
  lastMove: PropTypes.shape({
    fromSlot: PropTypes.oneOfType([
      PropTypes.oneOf([undefined]),
      PropTypes.number,
    ]),
    toSlot: PropTypes.oneOfType([
      PropTypes.oneOf([undefined]),
      PropTypes.number,
    ]),
  }).isRequired,
  legalMoves: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  nextMoveColor: PropTypes.string.isRequired,
  reversed: PropTypes.bool.isRequired,
};

export default Board;
