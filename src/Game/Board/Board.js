import React, { Component } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Square from '../Square/Square';
import XiangqiBoard from '../../logic';
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
    return getPiece(this.getCurrentBoard().board[slot]);
  }

  getCurrentBoard() {
    const { board } = this.props;
    return board;
  }

  getPostMoveParams(fromSlot, toSlot) {
    const { gameId } = this.props;
    const xboard = this.getCurrentBoard();
    const from = xboard.getRankFile(fromSlot).join(',');
    const to = xboard.getRankFile(toSlot).join(',');
    const piece = xboard.board[fromSlot];
    return [gameId, this.getActivePlayer().name, piece, from, to];
  }

  selectedCanCapture(slot) {
    const { selectedSlot } = this.state;
    const xboard = this.getCurrentBoard();
    if (selectedSlot === null) return false;
    if (!xboard.isOccupied(selectedSlot)) return false;
    if (!xboard.isOccupied(slot)) return false;
    return !xboard.sameColor(slot, selectedSlot);
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
    const { legalMoves } = this.props;
    const xboard = this.getCurrentBoard();
    if (!xboard.isColor(this.getActivePlayer().color, fromSlot)) return false;
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
    const { legalMoves, board } = this.props;

    // TODO Add loading spinner
    if (board === null) return (<div>Loading...</div>);

    const xboard = this.getCurrentBoard();
    const targets = (selectedSlot === null) ? [] : legalMoves[selectedSlot];

    return (
      <Wrapper className="Board">
        {xboard.board.map((_, i) => (
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
