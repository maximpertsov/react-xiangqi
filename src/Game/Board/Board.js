import React, { Component } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Square from '../Square/Square';
import { postMove } from '../../client';
import { getPiece } from '../Piece/Piece';
import { boardPropType } from '../../logic';

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

    this.state = {
      selectedSlot: null,
    };
  }

  getActivePlayer() {
    const { activePlayer } = this.props;
    return activePlayer();
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
    const { selectedSlot } = this.state;
    const { board } = this.props;
    if (selectedSlot === null) return false;
    if (!board.isOccupied(selectedSlot)) return false;
    if (!board.isOccupied(slot)) return false;
    return !board.sameColor(slot, selectedSlot);
  }

  handleSquareClick(square) {
    const { slot } = square.props;
    const { selectedSlot } = this.state;
    if (square.clickWillUnselect()) this.handleSelect(null);
    else if (square.isOccupied() && !this.selectedCanCapture(slot)) {
      this.handleSelect(slot);
    } else if (selectedSlot !== null) this.handleMove(selectedSlot, slot);
    else this.handleSelect(null);
  }

  handleSelect(slot) {
    this.setState({ selectedSlot: slot });
  }

  isLegalMove(fromSlot, toSlot) {
    const { board, legalMoves } = this.props;
    if (!board.isColor(this.getActivePlayer().color, fromSlot)) return false;
    return legalMoves[fromSlot].includes(toSlot);
  }

  handleMove(fromSlot, toSlot) {
    const { gameId, handleMove } = this.props;

    if (this.isLegalMove(fromSlot, toSlot)) {
      postMove(gameId, this.getPostMovePayload(fromSlot, toSlot))
        .then((response) => {
          const { status } = response;
          if (status === 201) {
            handleMove(fromSlot, toSlot);
          }
        })
        .catch((error) => {
          // TODO: display useful error
          throw error;
        });
    }
    this.handleSelect(null);
  }

  render() {
    const { selectedSlot } = this.state;
    const { board, legalMoves } = this.props;

    const targets = (selectedSlot === null) ? [] : legalMoves[selectedSlot];

    return (
      <Wrapper className="Board">
        {board.board.map((_, i) => (
          <Square
            key={i}
            slot={i}
            piece={this.getPieceOn(i)}
            selectedSlot={selectedSlot}
            targets={targets}
            handleSquareClick={this.handleSquareClick}
            getPieceOn={this.getPieceOn}
          />
        ))}
      </Wrapper>
    );
  }
}

Board.propTypes = {
  activePlayer: PropTypes.func.isRequired,
  board: boardPropType.isRequired,
  handleMove: PropTypes.func.isRequired,
  legalMoves: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  gameId: PropTypes.number.isRequired,
};

export default Board;
