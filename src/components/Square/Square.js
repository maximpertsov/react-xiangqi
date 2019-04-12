import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
  render() {
    return (
      <div className="Square">
        <img className="Piece" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Xiangqi_black_side_General.svg/50px-Xiangqi_black_side_General.svg.png" />
      </div>
    );
  }
}

export default Square;
