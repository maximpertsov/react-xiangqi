import React, { Component } from 'react';
import './Board.css';
import Square from '../Square/Square';

class Board extends Component {
  render() {
    return (
      <div className="Board">
        {[...Array(90)].map(() => <Square />)}
      </div>
    );
  }
}

export default Board;
