import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Square from '../Square/Square';
import { postMove } from '../../client';
import { getPiece } from '../Piece/Piece';
import { boardPropType } from '../../logic';
import { playerPropType } from '../../customPropTypes';

import boardImg from './board-1000px.svg.png';

const Wrapper = styled.div`
  background-image: url(${boardImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  display: grid;
  grid-template-rows: repeat(10, 60px);
  grid-template-columns: repeat(9, 60px);
  justify-content: center;
`;

const Board = ({
  activePlayer,
  board,
  handleLegalMove,
  handleSelect,
  fetchGame,
  legalMoves,
  selectedSlot,
  gameId,
}) => {
  const getPieceOn = (slot) => getPiece(board.getPiece(slot));

  const getPostMovePayload = (fromSlot, toSlot) => {
    const { name: player } = activePlayer;
    const fromPos = board.getRankFile(fromSlot);
    const toPos = board.getRankFile(toSlot);
    const piece = board.getPiece(fromSlot);
    return {
      player, piece, fromPos, toPos,
    };
  };

  const selectedCanCapture = (slot) => {
    if (selectedSlot === null) return false;
    if (!board.isOccupied(selectedSlot)) return false;
    if (!board.isOccupied(slot)) return false;
    return !board.sameColor(slot, selectedSlot);
  };

  const isLegalMove = (fromSlot, toSlot) => {
    const { color } = activePlayer;
    if (!board.isColor(color, fromSlot)) return false;
    return legalMoves[fromSlot].includes(toSlot);
  };

  const handleMove = (fromSlot, toSlot) => {
    if (isLegalMove(fromSlot, toSlot)) {
      handleLegalMove(fromSlot, toSlot);

      // Post move to server
      postMove(gameId, getPostMovePayload(fromSlot, toSlot))
        .then(({ status }) => {
          if (status !== 201) fetchGame();
        })
        .catch(() => {
          // TODO: display useful error?
          fetchGame();
        });
    }
    handleSelect({ slot: null });
  };

  const handleSquareClick = ({ slot, isOccupied }) => {
    if (slot === selectedSlot) {
      handleSelect({ slot: null });
    } else if (isOccupied && !selectedCanCapture(slot)) {
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
    const { color } = activePlayer;
    return board.kingInCheck(color) ? board.findKingSlot(color) : undefined;
  };

  const renderSquares = () => board.board.map((_, i) => (
    <Square
      key={i}
      slot={i}
      piece={getPieceOn(i)}
      inCheckSlot={getInCheckSlot()}
      targets={getTargets()}
      handleSquareClick={handleSquareClick}
      selected={selectedSlot === i}
    />
  ));

  return (
    <Wrapper className="Board">
      {renderSquares()}
    </Wrapper>
  );
};

Board.propTypes = {
  activePlayer: playerPropType.isRequired,
  board: boardPropType.isRequired,
  handleLegalMove: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  fetchGame: PropTypes.func.isRequired,
  legalMoves: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  selectedSlot: PropTypes.number,
  gameId: PropTypes.string.isRequired,
};

Board.defaultProps = {
  selectedSlot: null,
};

export default Board;
