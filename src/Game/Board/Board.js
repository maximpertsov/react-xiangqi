import React, { Component } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Square from '../Square/Square';
import XiangqiBoard from '../../logic';
import { postMove } from '../../client';
import { getPiece } from '../Piece/Piece';

import boardImg from './board-1000px.svg.png';

const Wrapper = styled.div`
  background-image: url(${boardImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
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
      xboard: null,
      moves: null,
      selectedSlot: null,
    };
  }

  componentDidMount() {
    this.setBoard();
  }

  getPieceOn(slot) {
    const { xboard } = this.state;
    return getPiece(xboard.board[slot]);
  }

  setBoard() {
    const { fen } = this.props;
    const xboard = new XiangqiBoard({ fen });
    this.setState({ xboard, moves: xboard.legalMoves() });
  }

  selectedCanCapture(slot) {
    const { selectedSlot, xboard } = this.state;
    if (selectedSlot === null) return false;
    if (!xboard.isOccupied(selectedSlot)) return false;
    if (!xboard.isOccupied(slot)) return false;
    return !xboard.sameColorSlot(slot, selectedSlot);
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
    const { moves } = this.state;
    return moves[fromSlot].includes(toSlot);
  }

  changePlayer() {
    const { changePlayer } = this.props;
    changePlayer();
  }

  handleMove(fromSlot, toSlot) {
    const { gameId, activePlayer } = this.props;

    if (this.isLegalMove(fromSlot, toSlot)) {
      this.setState((prevState) => {
        const from = prevState.xboard.getRankFile(fromSlot).join(',');
        const to = prevState.xboard.getRankFile(toSlot).join(',');
        const piece = prevState.xboard.board[fromSlot];

        postMove(gameId, activePlayer().name, piece, from, to)
          .then((response) => {
            const { status } = response;
            if (status === 201) {
              console.log('Successfully updated move');
            }
          })
          .catch((error) => {
            console.log(JSON.stringify(error));
          });

        const xboard = prevState.xboard.move(fromSlot, toSlot);
        this.changePlayer();
        return { xboard, moves: xboard.legalMoves() };
      });
      this.handleSelect(null);
    }
  }

  render() {
    const { xboard, selectedSlot, moves } = this.state;
    const targets = (selectedSlot === null) ? [] : moves[selectedSlot];

    // TODO Add loading spinner
    if (xboard === null) return (<div>Loading...</div>);

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
  changePlayer: PropTypes.func.isRequired,
  fen: PropTypes.string.isRequired,
  gameId: PropTypes.number.isRequired,
};

export default Board;
