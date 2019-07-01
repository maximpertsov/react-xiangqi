import React, { Component } from 'react';
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

class Board extends Component {
  constructor(props) {
    super(props);

    this.getPieceOn = this.getPieceOn.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
  }

  getActivePlayer() {
    const { activePlayer } = this.props;
    return activePlayer;
  }

  getPieceOn(slot) {
    const { board } = this.props;
    return getPiece(board.getPiece(slot));
  }

  getPostMovePayload(fromSlot, toSlot) {
    const { board } = this.props;
    const from = board.getRankFile(fromSlot);
    const to = board.getRankFile(toSlot);
    const piece = board.getPiece(fromSlot);
    return {
      player: this.getActivePlayer().name,
      piece,
      fromPos: from,
      toPos: to,
    };
  }

  selectedCanCapture(slot) {
    const { board, selectedSlot } = this.props;
    if (selectedSlot === null) return false;
    if (!board.isOccupied(selectedSlot)) return false;
    if (!board.isOccupied(slot)) return false;
    return !board.sameColor(slot, selectedSlot);
  }

  handleSquareClick({ slot, isOccupied }) {
    const { selectedSlot } = this.props;
    if (slot === selectedSlot) {
      this.handleSelect(null);
    } else if (isOccupied && !this.selectedCanCapture(slot)) {
      this.handleSelect(slot);
    } else if (selectedSlot !== null) {
      this.handleMove(selectedSlot, slot);
    } else {
      this.handleSelect(null);
    }
  }

  handleSelect(slot) {
    const { handleSelect } = this.props;
    handleSelect({ slot });
  }

  isLegalMove(fromSlot, toSlot) {
    const { board, legalMoves } = this.props;
    if (!board.isColor(this.getActivePlayer().color, fromSlot)) return false;
    return legalMoves[fromSlot].includes(toSlot);
  }

  handleMove(fromSlot, toSlot) {
    const { gameId, fetchGame, handleMove } = this.props;

    if (this.isLegalMove(fromSlot, toSlot)) {
      handleMove(fromSlot, toSlot);

      // Post move to server
      postMove(gameId, this.getPostMovePayload(fromSlot, toSlot))
        .then(({ status }) => {
          if (status !== 201) fetchGame();
        })
        .catch(() => {
          // TODO: display useful error?
          fetchGame();
        });
    }
    this.handleSelect(null);
  }

  render() {
    const {
      activePlayer: { color }, board, legalMoves, selectedSlot,
    } = this.props;

    const targets = (selectedSlot === null) ? [] : legalMoves[selectedSlot];
    // TODO: smell
    const inCheckSlot = (
      board.kingInCheck(color) ? board.findKingSlot(color) : undefined
    );

    return (
      <Wrapper className="Board">
        {board.board.map((_, i) => (
          <Square
            key={i}
            slot={i}
            piece={this.getPieceOn(i)}
            inCheckSlot={inCheckSlot}
            targets={targets}
            handleSquareClick={this.handleSquareClick}
            selected={selectedSlot === i}
          />
        ))}
      </Wrapper>
    );
  }
}

Board.propTypes = {
  activePlayer: playerPropType.isRequired,
  board: boardPropType.isRequired,
  handleMove: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  fetchGame: PropTypes.func.isRequired,
  legalMoves: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  selectedSlot: PropTypes.number.isRequired,
  gameId: PropTypes.string.isRequired,
};

export default Board;
