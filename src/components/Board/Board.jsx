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
      selected: null,
    };
  }

  render() {
    const { pieces, selected } = this.state;
    const keyFn = (i, j) => `square_${j}_${i}`;
    const selectedFn = (i, j) => selected === [i, j];

    return (
      <div className="Board">
        {pieces.map((row, i) => (
          row.map((p, j) => (
            <Square key={keyFn(i, j)} piece={p} selected={selectedFn(i, j)} />
          ))
        ))}
      </div>
    );
  }
}

export default Board;
