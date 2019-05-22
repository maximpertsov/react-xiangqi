import React, { Component } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Square from '../Square/Square';
import { fromFen } from '../../utils';
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

class Board extends Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleMove = this.handleMove.bind(this);

    this.state = {
      pieces: null,
      legalMoves: [...Array(RANKS * FILES)].map(() => [50]),
      selectedSlot: null,
    };
  }

  componentDidMount() {
    this.fetchBoard();
  }

  fetchBoard() {
    getInitialPosition().then((data) => {
      const { fen } = data;
      this.setState({ pieces: fromFen(fen) });
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
    const { pieces, selectedSlot, legalMoves } = this.state;
    const targets = (selectedSlot === null) ? [] : legalMoves[selectedSlot];

    // TODO Add loading spinner
    if (pieces === null) return (<div>Loading...</div>);

    return (
      <Wrapper className="Board">
        {pieces.map((pieceCode, i) => (
          <Square
            key={i}
            slot={i}
            piece={getPiece(pieceCode)}
            selectedSlot={selectedSlot}
            targets={targets}
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
