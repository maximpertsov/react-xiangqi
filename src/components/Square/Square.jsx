import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
  render() {
    return (
      <div className="Square">
        {this.props.piece}
      </div>
    );
  }
}

export default Square;
