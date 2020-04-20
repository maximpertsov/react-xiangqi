import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';

import {
  getBottomPlayerIsRed,
  getIsMoving,
  getSelectedMove,
  getTargets,
} from 'reducers';

import { MediaQuery, SquareSize } from 'commonStyles';

import { activeKing, decode as decodeFen, getPiece } from 'services/logic/fen';
import { encode as encodeSquare, moveToSquares } from 'services/logic/square';

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
  const targets = useSelector(state => getTargets(state), isEqual);
  const { fen, move: selectedMove, givesCheck } = useSelector(
    state => getSelectedMove(state),
    isEqual,
  );
  const isMoving = useSelector(state => getIsMoving(state));
  const [moveX, moveY] = useSelector(state => state.animationOffset, isEqual);

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
    square => givesCheck && activeKing(fen) === square,
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

  const renderTargetIndicator = useCallback(
    square => <TargetIndicator occupied={isOccupied(square)} />,
    [isOccupied],
  );

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

  const renderSquare = useCallback(
    // eslint-disable-next-line complexity
    square => (
      <Square
        className="Square"
        key={square}
        handleClick={handleSquareClick(square)}
      >
        {isOccupied(square) && renderPiece(square)}
        {inLastMove(square) && <LastMoveIndicator />}
        {kingIsInCheck(square) && <KingInCheckIndicator />}
        {isSelected(square) && <SelectionIndicator />}
        {isTargeted(square) && renderTargetIndicator(square)}
      </Square>
    ),
    [
      handleSquareClick,
      kingIsInCheck,
      inLastMove,
      isOccupied,
      isSelected,
      isTargeted,
      renderPiece,
      renderTargetIndicator,
    ],
  );

  const renderSquares = useCallback(
    () =>
      decodeFen(fen).placement.map((_, i, slots) => {
        const slot = getSlot(slots, i);
        const square = encodeSquare(slot);
        return renderSquare(square);
      }),
    [fen, getSlot, renderSquare],
  );

  return <Wrapper className="BoardView">{renderSquares()}</Wrapper>;
};

BoardView.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
};

export default BoardView;
