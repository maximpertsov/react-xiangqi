import React, { Component } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Square from '../Square/Square';
import { postMove } from '../../client';
import { getPiece } from '../Piece/Piece';

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
    return getPiece(board.board[slot]);
  }

  getPostMoveParams(fromSlot, toSlot) {
    const { gameId, board } = this.props;
    const from = board.getRankFile(fromSlot).join(',');
    const to = board.getRankFile(toSlot).join(',');
    const piece = board.board[fromSlot];
    return [gameId, this.getActivePlayer().name, piece, from, to];
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
    const { handleMove } = this.props;

    if (this.isLegalMove(fromSlot, toSlot)) {
      postMove(...this.getPostMoveParams(fromSlot, toSlot))
        .then((response) => {
          const { status } = response;
          if (status === 201) {
            console.log('Successfully updated move');
            handleMove(fromSlot, toSlot);
          }
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
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
  // TODO: specify board shape
  board: PropTypes.object.isRequired,
  handleMove: PropTypes.func.isRequired,
  // TODO: specify legalMoves shape
  legalMoves: PropTypes.array.isRequired,
  gameId: PropTypes.number.isRequired,
};

export default Board;
