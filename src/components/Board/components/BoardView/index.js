import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import {
  getBottomPlayerIsRed,
  getIsMoving,
  getSelectedBoard,
  getSelectedMove,
  getTargets,
} from 'reducers';

import { MediaQuery, SquareSize } from 'commonStyles';
import { getPiece } from 'services/logic/fen';
import { encode, moveToSquares } from 'services/logic/square';

import Square from './components/Square';
import Piece from './components/Piece';
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
  ${MediaQuery.TINY} {
    grid-template-rows: repeat(10, ${SquareSize.TINY});
    grid-template-columns: repeat(9, ${SquareSize.TINY});
  }
  ${MediaQuery.SMALL} {
    grid-template-rows: repeat(10, ${SquareSize.SMALL});
    grid-template-columns: repeat(9, ${SquareSize.SMALL});
  }
  ${MediaQuery.MEDIUM} {
    grid-template-rows: repeat(10, ${SquareSize.MEDIUM});
    grid-template-columns: repeat(9, ${SquareSize.MEDIUM});
  }
  ${MediaQuery.LARGE} {
    grid-template-rows: repeat(10, ${SquareSize.LARGE});
    grid-template-columns: repeat(9, ${SquareSize.LARGE});
  }
`;

const BoardView = ({ handleSquareClick }) => {
  const bottomPlayerIsRed = useSelector(state => getBottomPlayerIsRed(state));
  const selectedSquare = useSelector(state => state.selectedSquare);
  const targets = useSelector(state => getTargets(state));
  const { fen, move: selectedMove, givesCheck } = useSelector(state =>
    getSelectedMove(state),
  );
  const board = useSelector(state => getSelectedBoard(state));
  const isMoving = useSelector(state => getIsMoving(state));
  const [moveX, moveY] = useSelector(state => state.animationOffset);

  const getPieceCode = useCallback(
    square => getPiece(fen, square) || undefined,
    [fen],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fen, givesCheck],
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
      <Piece
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
