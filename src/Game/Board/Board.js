import React, { Component } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Square from '../Square/Square';
import { fromFen, legalMoves } from '../../utils';
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
      pieces: null,
      moves: null,
      selectedSlot: null,
    };
  }

  componentDidMount() {
    this.fetchBoard();
  }

  getPieceOn(slot) {
    const { pieces } = this.state;
    return getPiece(pieces[slot]);
  }

  updateLegalMoves() {
    this.setState((prevState) => ({ moves: legalMoves(prevState.pieces) }));
  }

  fetchBoard() {
    getInitialPosition().then((data) => {
      const { fen } = data;
      const pieces = fromFen(fen);
      this.setState({ pieces, moves: legalMoves(pieces) });
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

  handleMove(prevSlot, nextSlot) {
    const { changePlayer } = this.props;
    this.setState((prevState) => ({
      pieces: update(update([...prevState.pieces], {
        [nextSlot]: { $set: prevState.pieces[prevSlot] },
      }), {
        [prevSlot]: { $set: undefined },
      }),
    }));
    this.handleSelect(null);
    this.updateLegalMoves();
    changePlayer();
  }

  render() {
    const { pieces, selectedSlot, moves } = this.state;
    const targets = (selectedSlot === null) ? [] : moves[selectedSlot];

    // TODO Add loading spinner
    if (pieces === null) return (<div>Loading...</div>);

    return (
      <Wrapper className="Board">
        {pieces.map((_, i) => (
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
