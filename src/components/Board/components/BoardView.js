import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import {
  getBottomPlayerIsRed,
  getNextMoveColor,
  getSelectedMove,
  getTargets,
} from 'reducers';

import * as styles from 'commonStyles';

import Square from './Square';

import boardImg from '../board-1000px.svg.png';

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

const BoardView = ({ handleSquareClick }) => {
  const bottomPlayerIsRed = useSelector(state => getBottomPlayerIsRed(state));
  const nextMoveColor = useSelector(state => getNextMoveColor(state));
  const selectedSlot = useSelector(state => state.selectedSlot);
  const targets = useSelector(state => getTargets(state));
  const {
    board,
    fromSlot: moveFromSlot,
    toSlot: moveToSlot,
  } = useSelector(state => getSelectedMove(state));

  const getPieceCode = useCallback(slot => board.getPiece(slot) || undefined, [
    board,
  ]);

  const getSlot = useCallback(
    (b, i) => (bottomPlayerIsRed ? i : b.length - i - 1),
    [bottomPlayerIsRed],
  );

  const inLastMove = useCallback(
    slot => slot === moveFromSlot || slot === moveToSlot,
    [moveFromSlot, moveToSlot],
  );

  const renderSquares = () =>
    board.board.map((_, i, b) => {
      const slot = getSlot(b, i);
      return (
        <Square
          className="Square"
          key={slot}
          handleClick={handleSquareClick(slot)}
          inCheck={board.inCheck({ slot, nextMoveColor })}
          inLastMove={inLastMove(slot)}
          pieceCode={getPieceCode(slot)}
          selected={selectedSlot === slot}
          targeted={targets.includes(slot)}
        />
      );
    });

  return <Wrapper className="BoardView">{renderSquares()}</Wrapper>;
};

BoardView.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
};

export default BoardView;
