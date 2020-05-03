import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import isEqual from 'lodash/isEqual';

import clickSquare from 'actions/clickSquare';
import { activeKing, getPiece } from 'services/logic/fen';
import { moveToSquares } from 'services/logic/square';
import {
  getBottomPlayerIsRed,
  getIsMoving,
  getLegalMoves,
  getSelectedMove,
  getTargets,
} from 'reducers';

import SquareView from './SquareView';
import Piece from './Piece';
import DropIndicator from './DropIndicator';
import LastMoveIndicator from './LastMoveIndicator';
import KingInCheckIndicator from './KingInCheckIndicator';
import SelectionIndicator from './SelectionIndicator';
import TargetIndicator from './TargetIndicator';

// TODO make handle square click an action?
// eslint-disable-next-line complexity
const Square = ({ handleSquareClick, square }) => {
  const dispatch = useDispatch();

  const [moveX, moveY] = useSelector(state => state.animationOffset, isEqual);
  const bottomPlayerIsRed = useSelector(state => getBottomPlayerIsRed(state));
  const legalMoves = useSelector(state => getLegalMoves(state), isEqual);
  const isMoving = useSelector(state => getIsMoving(state));
  const selectedMove = useSelector(state => getSelectedMove(state), isEqual);
  const selectedSquare = useSelector(state => state.selectedSquare);
  const targets = useSelector(state => getTargets(state), isEqual);

  const handleClick = () => {
    dispatch(
      clickSquare({
        bottomPlayerIsRed,
        legalMoves,
        square,
        selectedMove,
        selectedSquare,
      }),
    );
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'PIECE',
    drop: () => {
      handleClick();
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const pieceCode = useMemo(
    () => getPiece(selectedMove.fen, square) || undefined,
    [selectedMove.fen, square],
  );

  const isOccupied = useMemo(() => pieceCode !== undefined, [pieceCode]);

  const isInLastMove = useMemo(() => {
    if (selectedMove.move === null) return false;

    return moveToSquares(selectedMove.move).includes(square);
  }, [selectedMove.move, square]);

  const isKingInCheck = useMemo(() => {
    if (!selectedMove.givesCheck) return false;

    return activeKing(selectedMove.fen) === square;
  }, [selectedMove.fen, selectedMove.givesCheck, square]);

  const isSelected = useMemo(() => {
    if (isMoving) return false;

    return selectedSquare === square;
  }, [isMoving, selectedSquare, square]);

  const isTargeted = useMemo(() => {
    if (isMoving) return false;

    // TODO: remove index access?
    return targets.some(move => moveToSquares(move)[1] === square);
  }, [isMoving, square, targets]);

  const renderTargetIndicator = useCallback(
    () => <TargetIndicator occupied={isOccupied} />,
    [isOccupied],
  );

  const renderPiece = useCallback(
    () => (
      <Piece
        code={pieceCode}
        moveX={selectedSquare === square ? moveX : 0}
        moveY={selectedSquare === square ? moveY : 0}
        square={square}
      />
    ),
    [moveX, moveY, pieceCode, selectedSquare, square],
  );

  return (
    <SquareView handleClick={handleClick} ref={drop}>
      {isOccupied && renderPiece()}
      {isOver && isTargeted && <DropIndicator />}
      {isInLastMove && <LastMoveIndicator />}
      {isKingInCheck && <KingInCheckIndicator />}
      {isSelected && <SelectionIndicator />}
      {isTargeted && renderTargetIndicator()}
    </SquareView>
  );
};

Square.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
  square: PropTypes.string.isRequired,
};

export default Square;
