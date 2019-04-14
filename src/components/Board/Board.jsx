/* eslint no-bitwise: ["error", { "allow": ["~"] }] */

import React, { Component } from 'react';
import styled from '@emotion/styled';
import Square from '../Square/Square';
import Piece from '../Piece/Piece';
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

    this.state = {
      pieces: [
        [<Piece />].concat([...Array(8)]),
      ].concat([...Array(9)].map(() => [...Array(9)])),
      selected: [0, 0],
    };
  }

  render() {
    const { pieces, selected } = this.state;
    const keyFn = (i, j) => `square_${j}_${i}`;
    const selectedFn = (i, j) => selected[0] === i && selected[1] === j;

    return (
      <Wrapper className="Board">
        {pieces.map((row, i) => (
          row.map((p, j) => (
            <Square key={keyFn(i, j)} piece={p} selected={selectedFn(i, j)} />
          ))
        ))}
      </Wrapper>
    );
  }
}

export default Board;
