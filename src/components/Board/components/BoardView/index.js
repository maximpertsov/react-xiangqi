import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import {
  getBottomPlayerIsRed,
  getIsMoving,
  getSelectedMove,
  getTargets,
} from 'reducers';

import * as styles from 'commonStyles';
import { encode, moveToSquares } from 'services/logic/square';

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
  const selectedSquare = useSelector(state => state.selectedSquare);
  const targets = useSelector(state => getTargets(state));
  const { board, move: selectedMove, givesCheck } = useSelector(state =>
    getSelectedMove(state),
  );
  const isMoving = useSelector(state => getIsMoving(state));
  const [moveX, moveY] = useSelector(state => state.animationOffset);

  const getPieceCode = useCallback(
    square => board.getPiece(square) || undefined,
    [board],
  );

  const getSlot = useCallback(
    (slots, i) => (bottomPlayerIsRed ? i : slots.length - i - 1),
    [bottomPlayerIsRed],
  );

  const inLastMove = useCallback(
    square => {
      if (selectedMove === null) return false;

      return moveToSquares(selectedMove).includes(square);
    },
    [selectedMove],
  );

  const kingIsInCheck = useCallback(
    square => givesCheck && board.activeKing() === square,
    [board, givesCheck],
  );

  const isSelected = useCallback(
    square => !isMoving && selectedSquare === square,
    [isMoving, selectedSquare],
  );

  const isTargeted = useCallback(
    square => {
      if (isMoving) return false;

      return targets.some(move => moveToSquares(move)[1] === square);
    },
    [isMoving, targets],
  );

  const isOccupied = useCallback(square => getPieceCode(square) !== undefined, [
    getPieceCode,
  ]);

  const renderPiece = useCallback(
    square => (
      <XiangqiPiece
        code={getPieceCode(square)}
        moveX={selectedSquare === square ? moveX : 0}
        moveY={selectedSquare === square ? moveY : 0}
      />
    ),
    [getPieceCode, moveX, moveY, selectedSquare],
  );

  /* eslint-disable complexity */
  const renderSquares = () =>
    board.placement.map((_, i, slots) => {
      const slot = getSlot(slots, i);
      const square = encode(slot);
      return (
        <Square
          className="Square"
          key={square}
          handleClick={handleSquareClick(square)}
        >
          {isOccupied(square) && renderPiece(square)}
          {inLastMove(square) && <LastMoveIndicator />}
          {kingIsInCheck(square) && <KingInCheckIndicator />}
          {isSelected(square) && <SelectionIndicator />}
          {isTargeted(square) && (
            <TargetIndicator occupied={isOccupied(square)} />
          )}
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
