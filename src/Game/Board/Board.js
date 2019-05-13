import React, { Component } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Square from '../Square/Square';
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

const RANKS = 10;
const FILES = 9;

const toSlot = (rank, file) => rank * FILES + file;

class Board extends Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleMove = this.handleMove.bind(this);

    this.state = {
      pieces: [...Array(RANKS * FILES)],
      selectedSlot: null,
    };
  }

  componentDidMount() {
    getInitialPosition()
      .then((data) => {
        data.pieces.forEach((piece) => {
          this.setState((prevState) => ({
            pieces: update(prevState.pieces, {
              [toSlot(piece.rank, piece.file)]: { $set: piece.code },
            }),
          }));
        });
      });
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
    changePlayer();
  }

  render() {
    const { pieces, selectedSlot } = this.state;

    return (
      <Wrapper className="Board">
        {pieces.map((pieceCode, i) => (
          <Square
            key={i}
            slot={i}
            piece={getPiece(pieceCode)}
            selectedSlot={selectedSlot}
            handleMove={this.handleMove}
            handleSelect={this.handleSelect}
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
