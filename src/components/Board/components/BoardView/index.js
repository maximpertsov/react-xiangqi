import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import {
  getBottomPlayerIsRed,
  getIsMoving,
  getNextMoveColor,
  getSelectedMove,
  getTargets,
} from 'reducers';

import * as styles from 'commonStyles';
import { encode } from 'services/logic/square';

import Square from './components/Square';
import XiangqiPiece from './components/Piece';
import LastMoveIndicator from './components/LastMoveIndicator';
import KingInCheckIndicator from './components/KingInCheckIndicator';
import SelectionIndicator from './components/SelectionIndicator';
import TargetIndicator from './components/TargetIndicator';

import boardImg from './assets/board-1000px.svg.png';

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
  const isMoving = useSelector(state => getIsMoving(state));
  const [moveX, moveY] = useSelector(state => state.animationOffset);

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

  const kingIsInCheck = useCallback(
    slot => !isMoving && board.inCheck({ slot, nextMoveColor }),
    [board, isMoving, nextMoveColor],
  );

  const isSelected = useCallback(slot => !isMoving && selectedSlot === slot, [
    isMoving,
    selectedSlot,
  ]);

  const isTargeted = useCallback(
    slot => {
      if (isMoving) return false;

      const toSquare = encode(slot);
      return targets.some(move => move.endsWith(toSquare));
    },
    [isMoving, targets],
  );

  const isOccupied = useCallback(slot => getPieceCode(slot) !== undefined, [
    getPieceCode,
  ]);

  const renderPiece = useCallback(
    slot => (
      <XiangqiPiece
        code={getPieceCode(slot)}
        moveX={selectedSlot === slot ? moveX : 0}
        moveY={selectedSlot === slot ? moveY : 0}
      />
    ),
    [getPieceCode, moveX, moveY, selectedSlot],
  );

  /* eslint-disable complexity */
  const renderSquares = () =>
    board.placement.map((_, i, b) => {
      const slot = getSlot(b, i);
      return (
        <Square
          className="Square"
          key={slot}
          handleClick={handleSquareClick(slot)}
        >
          {isOccupied(slot) && renderPiece(slot)}
          {inLastMove(slot) && <LastMoveIndicator />}
          {kingIsInCheck(slot) && <KingInCheckIndicator />}
          {isSelected(slot) && <SelectionIndicator />}
          {isTargeted(slot) && <TargetIndicator occupied={isOccupied(slot)} />}
        </Square>
      );
    });
  /* eslint-enable complexity */

  return <Wrapper className="BoardView">{renderSquares()}</Wrapper>;
};

BoardView.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
};

export default BoardView;
