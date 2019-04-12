/* eslint no-bitwise: ["error", { "allow": ["~"] }] */

import React, { Component } from 'react';
import './Board.css';
import Square from '../Square/Square';
import Piece from '../Piece/Piece';

class Board extends Component {
  render() {
    const showImg = (i) => [0, 1, 8, 9].includes(~~(i / 9));
    const keyFn = (i) => `square_${i}`;

    return (
      <div className="Board">
        {[...Array(90)].map((_, i) => (
          <Square key={keyFn(i)} piece={showImg(i) ? <Piece /> : null} />
        ))}
      </div>
    );
  }
}

export default Board;
