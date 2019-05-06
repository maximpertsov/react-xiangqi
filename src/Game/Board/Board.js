import React, { Component } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
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

    this.handleSelect = this.handleSelect.bind(this);
    this.handleMove = this.handleMove.bind(this);

    this.state = {
      pieces: layout,
      selectedCol: null,
      selectedRow: null,
    };
  }

  handleSelect(row, col) {
    this.setState({ selectedCol: col, selectedRow: row });
  }

  handleMove(prevRow, prevCol, nextRow, nextCol) {
    const { changePlayer } = this.props;
    this.setState((prevState) => ({
      pieces: update(update([...prevState.pieces], {
        [nextRow]: { [nextCol]: { $set: prevState.pieces[prevRow][prevCol] } },
      }), {
        [prevRow]: { [prevCol]: { $set: undefined } },
      }),
    }));
    this.handleSelect(null, null);
    changePlayer();
  }

  render() {
    const {
      pieces, selectedRow, selectedCol,
    } = this.state;

    const { redPlayer, blackPlayer, activePlayer } = this.props;
    const { color } = activePlayer().props;

    // TODO: move this to another component
    const matchInfo = (
      <div>
        <p>
          { `${redPlayer.props.name} [red] vs ${blackPlayer.props.name} [black]` }
        </p>
        <p>
          { `${color}'s turn` }
        </p>
      </div>
    );

    return (
      <div>
        { matchInfo }
        <Wrapper className="Board">
          {pieces.map((row, i) => (
            row.map((p, j) => (
              <Square
                key={cellID(i, j)}
                row={i}
                col={j}
                piece={p}
                selectedRow={selectedRow}
                selectedCol={selectedCol}
                handleMove={this.handleMove}
                handleSelect={this.handleSelect}
              />
            ))
          ))}
        </Wrapper>
      </div>
    );
  }
}

Board.propTypes = {
  blackPlayer: PropTypes.element.isRequired,
  redPlayer: PropTypes.element.isRequired,
  activePlayer: PropTypes.func.isRequired,
  changePlayer: PropTypes.func.isRequired,
};

export default Board;
