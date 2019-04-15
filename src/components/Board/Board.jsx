/* eslint no-bitwise: ["error", { "allow": ["~"] }] */

import React, { Component } from 'react';
import styled from '@emotion/styled';
import Square from '../Square/Square';
import { Piece, BlackGeneral } from '../Piece/Piece';

import boardImg from './board-1000px.svg.png';
import blackAdvisorImg from '../Piece/black-advisor-50px.svg.png';
import redAdvisorImg from '../Piece/red-advisor-50px.svg.png';
import blackCannonImg from '../Piece/black-cannon-50px.svg.png';
import redCannonImg from '../Piece/red-cannon-50px.svg.png';
import blackChariotImg from '../Piece/black-chariot-50px.svg.png';
import redChariotImg from '../Piece/red-chariot-50px.svg.png';
import blackHorseImg from '../Piece/black-horse-50px.svg.png';
import redHorseImg from '../Piece/red-horse-50px.svg.png';
import blackElephantImg from '../Piece/black-elephant-50px.svg.png';
import redElephantImg from '../Piece/red-elephant-50px.svg.png';
import redGeneralImg from '../Piece/red-general-50px.svg.png';
import blackSoldierImg from '../Piece/black-soldier-50px.svg.png';
import redSoldierImg from '../Piece/red-soldier-50px.svg.png';

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

    // board layout
    // black back row
    pieces[0][0] = <Piece icon={blackChariotImg} name="black chariot" />;
    pieces[0][1] = <Piece icon={blackHorseImg} name="black horse" />;
    pieces[0][2] = <Piece icon={blackElephantImg} name="black elephant" />;
    pieces[0][3] = <Piece icon={blackAdvisorImg} name="black advisor" />;
    pieces[0][4] = <BlackGeneral />;
    pieces[0][5] = <Piece icon={blackAdvisorImg} name="black advisor" />;
    pieces[0][6] = <Piece icon={blackElephantImg} name="black elephant" />;
    pieces[0][7] = <Piece icon={blackHorseImg} name="black horse" />;
    pieces[0][8] = <Piece icon={blackChariotImg} name="black chariot" />;
    // black cannons
    pieces[2][1] = <Piece icon={blackCannonImg} name="black cannon" />;
    pieces[2][7] = <Piece icon={blackCannonImg} name="black cannon" />;
    // black pawns
    pieces[3][0] = <Piece icon={blackSoldierImg} name="black soldier" />;
    pieces[3][2] = <Piece icon={blackSoldierImg} name="black soldier" />;
    pieces[3][4] = <Piece icon={blackSoldierImg} name="black soldier" />;
    pieces[3][6] = <Piece icon={blackSoldierImg} name="black soldier" />;
    pieces[3][8] = <Piece icon={blackSoldierImg} name="black soldier" />;

    // board layout
    // red back row
    pieces[9][0] = <Piece icon={redChariotImg} name="red chariot" />;
    pieces[9][1] = <Piece icon={redHorseImg} name="red horse" />;
    pieces[9][2] = <Piece icon={redElephantImg} name="red elephant" />;
    pieces[9][3] = <Piece icon={redAdvisorImg} name="red advisor" />;
    pieces[9][4] = <Piece icon={redGeneralImg} name="red general" />;
    pieces[9][5] = <Piece icon={redAdvisorImg} name="red advisor" />;
    pieces[9][6] = <Piece icon={redElephantImg} name="red elephant" />;
    pieces[9][7] = <Piece icon={redHorseImg} name="red horse" />;
    pieces[9][8] = <Piece icon={redChariotImg} name="red chariot" />;
    // red cannons
    pieces[7][1] = <Piece icon={redCannonImg} name="red cannon" />;
    pieces[7][7] = <Piece icon={redCannonImg} name="red cannon" />;
    // red pawns
    pieces[6][0] = <Piece icon={redSoldierImg} name="red soldier" />;
    pieces[6][2] = <Piece icon={redSoldierImg} name="red soldier" />;
    pieces[6][4] = <Piece icon={redSoldierImg} name="red soldier" />;
    pieces[6][6] = <Piece icon={redSoldierImg} name="red soldier" />;
    pieces[6][8] = <Piece icon={redSoldierImg} name="red soldier" />;

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
