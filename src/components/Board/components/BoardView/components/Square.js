import React from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import actions from 'actions';
import animateMove from 'actions/animateMove';
import makeMove from 'actions/makeMove';
import { useSquareContext } from 'contexts/SquareProvider';
import { getBottomPlayerIsRed, getLegalMoves } from 'reducers';
import { isOccupied, sameTeam } from 'services/logic/fen';
import { squaresToUci } from 'services/logic/square';

import DropIndicator from './DropIndicator';
import KingInCheckIndicator from './KingInCheckIndicator';
import LastMoveIndicator from './LastMoveIndicator';
import Piece from './Piece';
import SelectionIndicator from './SelectionIndicator';
import SquareView from './SquareView';
import TargetIndicator from './TargetIndicator';

const ANIMATION_DELAY = 150;

const mapStateToProps = createSelector(
  [state => state],

  state => ({
    bottomPlayerIsRed: getBottomPlayerIsRed(state),
    legalMoves: getLegalMoves(state),
    selectedFen: state.selectedFen,
    selectedSquare: state.selectedSquare,
  }),
);

// TODO make handle square click an action?
const Square = () => {
  const dispatch = useDispatch();
  const { square } = useSquareContext();
  const {
    bottomPlayerIsRed,
    legalMoves,
    selectedFen,
    selectedSquare,
  } = useSelector(mapStateToProps, isEqual);

  const selectedCanCapture = () => {
    if (selectedSquare === null) return false;
    if (!isOccupied(selectedFen, selectedSquare)) return false;
    if (!isOccupied(selectedFen, square)) return false;

    return !sameTeam(selectedFen, square, selectedSquare);
  };

  const legalFen = uci => get(legalMoves, uci, false);

  const handleMove = uci => {
    const fen = legalFen(uci);
    if (fen) {
      dispatch(animateMove({ bottomPlayerIsRed, uci }));
      setTimeout(() => {
        dispatch(makeMove({ fen, uci }));
        dispatch(actions.board.animationOffset.clear());
        dispatch(actions.board.selectedSquare.set(null));
      }, ANIMATION_DELAY);
    } else {
      dispatch(actions.board.selectedSquare.set(null));
    }
  };

  const handleSquareClick = () => {
    if (square === selectedSquare) {
      dispatch(actions.board.selectedSquare.set(null));
    } else if (isOccupied(selectedFen, square) && !selectedCanCapture()) {
      dispatch(actions.board.selectedSquare.set(square));
    } else if (selectedSquare !== null) {
      handleMove(squaresToUci(selectedSquare, square));
    } else {
      dispatch(actions.board.selectedSquare.set(null));
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'PIECE',
    drop: () => {
      handleSquareClick();
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <SquareView handleClick={handleSquareClick} ref={drop}>
      <Piece />
      {isOver && <DropIndicator />}
      <LastMoveIndicator />
      <KingInCheckIndicator />
      <SelectionIndicator />
      <TargetIndicator />
    </SquareView>
  );
};

export default Square;
