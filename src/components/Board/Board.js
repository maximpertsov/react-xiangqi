/* eslint no-bitwise: ["error", { "allow": ["~"] }] */

import React, { Component } from 'react';
import './Board.css';
import Square from '../Square/Square';

class Board extends Component {
  render() {
    const pieceImgSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Xiangqi_black_side_General.svg/50px-Xiangqi_black_side_General.svg.png';
    const showImg = (i) => [0, 1, 8, 9].includes(~~(i / 9));

    return (
      <div className="Board">
        {[...Array(90)].map((x, i) => <Square pieceImgSrc={showImg(i) ? pieceImgSrc : ""} />)}
      </div>
    );
  }
}

export default Board;
