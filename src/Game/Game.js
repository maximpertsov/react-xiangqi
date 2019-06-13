import React, { Component } from 'react';
import styled from '@emotion/styled';
import Board from './Board/Board';
import GameInfo from './GameInfo';
import { getGame } from '../client';

const GAME_PK = 2;

const Wrapper = styled.div`
  text-align: center;
`;

class Game extends Component {
  constructor(props) {
    super(props);

    this.activePlayer = this.activePlayer.bind(this);
    this.changePlayer = this.changePlayer.bind(this);
    this.refreshState = this.refreshState.bind(this);

    this.state = {
      activePlayerIdx: 0,
      players: [],
      fen: null,
    };
  }

  refreshState() {
    getGame(GAME_PK).then((data) => {
      const { players, fen, active_color } = data;
      const activePlayerIdx = players.map((p) => p.color).indexOf(active_color);
      this.setState({ players, fen, activePlayerIdx });
    });
  }

  componentDidMount() {
    this.refreshState();
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

  gameInfoOrLoading() {
    const { players } = this.state;
    if (players.length === 0) return (<div><p>Loading...</p></div>);
    return (
      <GameInfo
        redPlayer={players.find((p) => p.color === 'red')}
        blackPlayer={players.find((p) => p.color === 'black')}
        activePlayer={this.activePlayer}
      />
    );
  }

  boardOrLoading() {
    const { fen } = this.state;
    if (fen === null) return (<div><p>Loading...</p></div>);
    return (
      <Board
        activePlayer={this.activePlayer}
        changePlayer={this.changePlayer}
        refreshState={this.refreshState}
        fen={fen}
        gameId={GAME_PK}
      />
    );
  }

  render() {
    return (
      <Wrapper className="Game">
        { this.boardOrLoading() }
        { this.gameInfoOrLoading() }
      </Wrapper>
    );
  }
}

export default Game;
