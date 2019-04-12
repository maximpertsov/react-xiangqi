import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
  render() {
    return (
      <div className="Square">
        <img className="Piece" src={this.props.pieceImgSrc} />
      </div>
    );
  }
}

export default Square;
