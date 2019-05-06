import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Board from './Board/Board';
import Player from './Player/Player';

const redPlayer = <Player color="red" />;

const blackPlayer = <Player color="black" />;

const Wrapper = styled.div`
  text-align: center;
`;

class Game extends Component {
  constructor(props) {
    super(props);
    const { players } = this.props;

    this.activePlayer = this.activePlayer.bind(this);
    this.changePlayer = this.changePlayer.bind(this);

    this.state = {
      activePlayerIdx: 0,
      players,
    };
  }

  activePlayer() {
    const { players, activePlayerIdx } = this.state;
    return players[activePlayerIdx];
  }

  changePlayer() {
    const { players } = this.state;
    this.setState((prevState) => ({
      activePlayerIdx: (prevState.activePlayerIdx + 1) % players.length,
    }));
  }

  render() {
    const { players } = this.state;
    return (
      <Wrapper className="Game">
        <Board
          redPlayer={players[0]}
          blackPlayer={players[1]}
        />
      </Wrapper>
    );
  }
}

Game.propTypes = {
  players: PropTypes.arrayOf(PropTypes.element),
};

Game.defaultProps = {
  players: [redPlayer, blackPlayer],
};

export default Game;
