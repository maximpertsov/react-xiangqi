import React, { Component } from 'react';
import styled from '@emotion/styled';
import Board from './Board/Board';
import GameInfo from './GameInfo';
import { getGame } from '../client';

const Wrapper = styled.div`
  text-align: center;
`;

class Game extends Component {
  constructor(props) {
    super(props);

    this.activePlayer = this.activePlayer.bind(this);
    this.changePlayer = this.changePlayer.bind(this);

    this.state = {
      activePlayerIdx: 0,
      players: [],
    };
  }

  componentDidMount() {
    getGame(1).then((data) => {
      this.setState({ players: data.players });
    });
  }

  // TODO: create PlayerManager class?
  activePlayer() {
    const { players, activePlayerIdx } = this.state;
    return players[activePlayerIdx];
  }

  // TODO: create PlayerManager class?
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
        <GameInfo
          redPlayer={players[0]}
          blackPlayer={players[1]}
          activePlayer={this.activePlayer}
        />
        <Board
          changePlayer={this.changePlayer}
        />
      </Wrapper>
    );
  }
}

export default Game;
