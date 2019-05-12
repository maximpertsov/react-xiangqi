import React, { Component } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Square from '../Square/Square';
import { cellID } from './utils';
import { getInitialPosition } from '../../client';
import { getPiece } from '../Piece/Piece';


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
      pieces: [...Array(10)].map(() => [...Array(9)]),
      selectedCol: null,
      selectedRow: null,
    };
  }

  componentDidMount() {
    getInitialPosition()
      .then((data) => {
        data.pieces.forEach((piece) => {
          this.setState((prevState) => ({
            pieces: update(prevState.pieces, {
              [piece.rank]: {
                [piece.file]: { $set: piece.code },
              },
            }),
          }));
        });
      });
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

    return (
      <Wrapper className="Board">
        {pieces.map((row, i) => (
          row.map((pieceCode, j) => (
            <Square
              key={cellID(i, j)}
              row={i}
              col={j}
              piece={getPiece(pieceCode)}
              selectedRow={selectedRow}
              selectedCol={selectedCol}
              handleMove={this.handleMove}
              handleSelect={this.handleSelect}
            />
          ))
        ))}
      </Wrapper>
    );
  }
}

Board.propTypes = {
  changePlayer: PropTypes.func.isRequired,
};

export default Board;
