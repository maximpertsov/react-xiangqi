import React, { Component } from 'react';
import styled from '@emotion/styled';
import Square from '../Square/Square';
import layout from '../Piece/utils';
import { cellID } from './utils';

import boardImg from './board-1000px.svg.png';

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

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      pieces: layout,
      selected: null,
    };
  }

  handleClick(cellName) {
    this.setState({ selected: cellName });
  }

  render() {
    const { pieces, selected } = this.state;

    return (
      <Wrapper className="Board">
        {pieces.map((row, i) => (
          row.map((p, j) => (
            <Square
              key={cellID(i, j)}
              cellName={cellID(i, j)}
              piece={p}
              selected={selected === cellID(i, j)}
              handleClick={this.handleClick}
            />
          ))
        ))}
      </Wrapper>
    );
  }
}

export default Board;
