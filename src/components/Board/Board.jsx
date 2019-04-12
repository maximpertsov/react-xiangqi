/* eslint no-bitwise: ["error", { "allow": ["~"] }] */

import React, { Component } from 'react';
import './Board.css';
import Square from '../Square/Square';
import Piece from '../Piece/Piece';

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pieces: [
        [<Piece />].concat([...Array(8)]),
      ].concat([...Array(8)].map(() => [...Array(9)])),
    };
  }

  render() {
    const { pieces } = this.state;
    const keyFn = (i, j) => `square_${j}_${i}`;

    return (
      <div className="Board">
        {pieces.map((row, i) => (
          row.map((p, j) => <Square key={keyFn(i, j)} piece={p} />)
        ))}
      </div>
    );
  }
}

export default Board;
