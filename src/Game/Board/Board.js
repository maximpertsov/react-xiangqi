import React, { Component } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Square from '../Square/Square';
import XiangqiBoard from '../../logic.class';
import { getInitialPosition } from '../../client';
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
    this.fetchBoard();
  }

  getPieceOn(slot) {
    const { xboard } = this.state;
    return getPiece(xboard.board[slot]);
  }

  fetchBoard() {
    getInitialPosition().then((data) => {
      const { fen } = data;
      const xboard = new XiangqiBoard({ fen });
      this.setState({ xboard, moves: xboard.legalMoves() });
    });
  }

  selectedCanCapture(slot) {
    const { selectedSlot } = this.state;
    const selectedPiece = this.getPieceOn(selectedSlot);
    const targetedPiece = this.getPieceOn(slot);
    if (selectedPiece === undefined || targetedPiece === undefined) {
      return false;
    }
    return targetedPiece.props.color !== selectedPiece.props.color;
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

  isLegalMove(prevSlot, nextSlot) {
    const { moves } = this.state;
    return moves[prevSlot].includes(nextSlot);
  }

  changePlayer() {
    const { changePlayer } = this.props;
    changePlayer();
  }

  handleMove(prevSlot, nextSlot) {
    if (this.isLegalMove(prevSlot, nextSlot)) {
      this.setState((prevState) => {
        const xboard = prevState.xboard.move(prevSlot, nextSlot);
        return { xboard, moves: xboard.legalMoves() };
      });
      this.changePlayer();
    }
    this.handleSelect(null);
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
  changePlayer: PropTypes.func.isRequired,
};

export default Board;
