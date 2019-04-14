/* eslint no-bitwise: ["error", { "allow": ["~"] }] */

import React, { Component } from 'react';
import styled from '@emotion/styled';
import Square from '../Square/Square';
import Piece from '../Piece/Piece';

import boardImg from './board-1000px.svg.png';
import blackChariotImg from '../Piece/black-chariot-50px.svg.png';
import blackHorseImg from '../Piece/black-horse-50px.svg.png';
import blackElephantImg from '../Piece/black-elephant-50px.svg.png';
import blackGeneralImg from '../Piece/black-general-50px.svg.png';
import blackSoldierImg from '../Piece/black-soldier-50px.svg.png';

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

    const pieces = [...Array(10)].map(() => [...Array(9)]);

    // Board layout
    pieces[0][0] = <Piece icon={blackChariotImg} name="black chariot" />;
    pieces[0][1] = <Piece icon={blackHorseImg} name="black horse" />;
    pieces[0][2] = <Piece icon={blackElephantImg} name="black elephant" />;
    pieces[0][4] = <Piece icon={blackGeneralImg} name="black general" />;
    pieces[0][6] = <Piece icon={blackElephantImg} name="black elephant" />;
    pieces[0][7] = <Piece icon={blackHorseImg} name="black horse" />;
    pieces[0][8] = <Piece icon={blackChariotImg} name="black chariot" />;

    pieces[3][0] = <Piece icon={blackSoldierImg} name="black soldier" />;
    pieces[3][2] = <Piece icon={blackSoldierImg} name="black soldier" />;
    pieces[3][4] = <Piece icon={blackSoldierImg} name="black soldier" />;
    pieces[3][6] = <Piece icon={blackSoldierImg} name="black soldier" />;
    pieces[3][8] = <Piece icon={blackSoldierImg} name="black soldier" />;

    this.state = {
      pieces,
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
