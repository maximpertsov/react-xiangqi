import React, { Component } from 'react';
import styled from '@emotion/styled';
import update from 'immutability-helper';
import Board from './Board/Board';
import Move from './Move/Move';
import GameInfo from './GameInfo';
import XiangqiBoard, { RefType } from '../logic';
import { getGame, getMoves } from '../client';

const GAME_PK = 2;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  height: 600px;
`;

const SidebarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 0px 50px;
  height: 100%;
`;

const InfoWrapper = styled.div`
  height: 20%;
`;

// TODO: set max-height by percentage?
const MovesWrapper = styled.div`
  display: grid;
  grid-template-columns: 50% auto;
  outline: 2px solid;
  height: 55%;
  overflow: auto;
`;

class Game extends Component {
  constructor(props) {
    super(props);

    this.activePlayer = this.activePlayer.bind(this);
    this.changePlayer = this.changePlayer.bind(this);
    this.handleMove = this.handleMove.bind(this);

    this.state = {
      activePlayerIdx: 0,
      players: [],
      fen: null,
      moves: [],
      boards: [],
    };
  }

  componentDidMount() {
    this.fetchGame();
  }

  fetchMoves() {
    const { fen } = this.state;
    getMoves(GAME_PK).then((data) => {
      const { moves } = data;
      const toState = [];
      moves.reduce(
        (board, move) => {
          const { from_position: fromPos, to_position: toPos } = move;
          const result = {
            move,
            board: board.move(fromPos, toPos, RefType.RANK_FILE_STRING),
          };
          // TODO: construct this line in the move component
          result.move.description = `${move.from_position} -> ${move.to_position}`;
          toState.push(result);
          return result.board;
        },
        new XiangqiBoard({ fen }),
      );
      this.setState({
        moves: toState.map((d) => d.move),
        boards: toState.map((d) => d.board),
      });
    });
  }

  fetchGame() {
    getGame(GAME_PK).then((data) => {
      const { players, initial_fen, active_color } = data;
      const activePlayerIdx = players.map((p) => p.color).indexOf(active_color);
      this.setState({ players, fen: initial_fen, activePlayerIdx });
      this.fetchMoves();
    });
  }

  handleMove(fromSlot, toSlot) {
    this.setState((fromState) => {
      const { boards } = fromState;
      const fromBoard = boards[boards.length - 1];
      return {
        boards: update(boards, { $push: [fromBoard.move(fromSlot, toSlot)] }),
        // TODO: add new move to moves state
      };
    });
    this.changePlayer();
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
    // TODO: move info wrapper to GameInfo class
    return (
      <InfoWrapper>
        <GameInfo
          redPlayer={players.find((p) => p.color === 'red')}
          blackPlayer={players.find((p) => p.color === 'black')}
          activePlayer={this.activePlayer}
        />
      </InfoWrapper>
    );
  }

  renderMoves() {
    const { moves } = this.state;
    const moveComponents = moves.map((m) => {
      const key = `${m.player.color}_${m.order}`;
      return (<Move key={key} description={m.description} />);
    });
    return (<MovesWrapper>{moveComponents}</MovesWrapper>);
  }

  boardOrLoading() {
    const { boards } = this.state;
    if (boards.length === 0) return (<div><p>Loading...</p></div>);

    const board = boards[boards.length - 1];

    return (
      <Board
        activePlayer={this.activePlayer}
        board={board}
        legalMoves={board.legalMoves()}
        handleMove={this.handleMove}
        gameId={GAME_PK}
      />
    );
  }

  render() {
    return (
      <Wrapper className="Game">
        { this.boardOrLoading() }
        <SidebarWrapper>
          { this.gameInfoOrLoading() }
          { this.renderMoves() }
        </SidebarWrapper>
      </Wrapper>
    );
  }
}

export default Game;
