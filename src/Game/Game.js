import React, { Component } from 'react';
import styled from '@emotion/styled';
import update from 'immutability-helper';
import Board from './Board/Board';
import Move from './Move/Move';
import GameInfo from './GameInfo';
import LoginForm from '../LoginForm/LoginForm';
import XiangqiBoard, { RefType } from '../logic';
import { getGame, getMoves } from '../client';

const GAME_ID = 'ABC123';

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

// TODO: set max-height by percentage?
const MovesWrapper = styled.div`
  display: grid;
  grid-template-columns: 50% auto;
  grid-template-rows: repeat(auto-fill, 50px);
  outline: 2px solid;
  height: 55%;
  overflow: auto;
`;

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePlayerIdx: 0,
      players: [],
      moves: [],
      selectedMove: null,
      username: null,
    };

    this.changePlayer = this.changePlayer.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleMoveSelect = this.handleMoveSelect.bind(this);
    this.fetchGame = this.fetchGame.bind(this);
    this.setUsername = this.setUsername.bind(this);
  }

  componentDidMount() {
    this.fetchGame();
  }

  scrollToBottomOfMovelist() {
    try {
      this.el.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      if (e instanceof TypeError) {
        // pass
      } else { throw e; }
    }
  }

  fetchMoves(fen) {
    getMoves(GAME_ID).then((response) => {
      const { moves: movesData } = response.data;
      const moves = [
        {
          piece: undefined,
          fromPos: undefined,
          toPos: undefined,
          board: new XiangqiBoard({ fen }),
        },
      ];
      movesData.reduce(
        (lastBoard, moveData) => {
          const { piece, origin: fromPos, destination: toPos } = moveData;
          const board = lastBoard.move(fromPos, toPos, RefType.RANK_FILE);
          const move = {
            piece, fromPos, toPos, board,
          };
          moves.push(move);
          return move.board;
        },
        moves[0].board,
      );
      // TODO: There is one more board than moves.
      // Watch out for off by 1 errors!
      this.setState({ moves, selectedMove: moves.length - 1 });
      this.scrollToBottomOfMovelist();
    });
  }

  fetchGame() {
    getGame(GAME_ID).then((response) => {
      const {
        players,
        initial_fen: fen,
        active_color: activeColor,
      } = response.data;
      const activePlayerIdx = players.map((p) => p.color).indexOf(activeColor);
      this.setState({ players, activePlayerIdx });
      this.fetchMoves(fen);
    });
  }

  handleMove(fromSlot, toSlot) {
    this.setState((fromState) => {
      const { moves } = fromState;
      const { board: lastBoard } = moves[moves.length - 1];
      const nextMove = {
        fromPos: lastBoard.getRankFile(fromSlot),
        toPos: lastBoard.getRankFile(toSlot),
        piece: lastBoard.getPiece(fromSlot),
        board: lastBoard.move(fromSlot, toSlot),
      };
      return {
        moves: update(moves, { $push: [nextMove] }),
        selectedMove: moves.length,
      };
    });
    this.changePlayer();
  }

  handleMoveSelect(e, order) {
    this.setState({ selectedMove: order });
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

  getUserPlayer() {
    const { username, players } = this.state;
    return players.find((p) => p.name === username) || {};
  }

  getUserColor() {
    return this.getUserPlayer().color;
  }

  setUsername(username) {
    this.setState({ username });
  }

  renderMoves() {
    const { moves, selectedMove } = this.state;
    const scrollTarget = (<div ref={(el) => { this.el = el; }} />);
    const moveComponents = moves
      .map((m, i) => (
        <Move
          key={i}
          order={i}
          handleMoveSelect={this.handleMoveSelect}
          fromPos={m.fromPos}
          toPos={m.toPos}
          piece={m.piece}
          selected={selectedMove === i}
        />
      ));
    return (
      <MovesWrapper>
        {moveComponents}
        {scrollTarget}
      </MovesWrapper>
    );
  }

  renderBoardOrLoading() {
    const { moves, selectedMove } = this.state;
    const userColor = this.getUserColor();

    if (moves.length === 0) return (<div><p>Loading...</p></div>);

    const { board, piece } = moves[selectedMove];
    const legalMoves = board
      .legalMovesByActiveColor(piece)
      .map(
        (toSlots) => (selectedMove === moves.length - 1 ? toSlots : []),
      )
      .map(
        (toSlots, fromSlot) => (
          board.isColor(userColor, fromSlot) ? toSlots : []
        ),
      );

    return (
      <Board
        activePlayer={this.activePlayer()}
        board={board}
        fetchGame={this.fetchGame}
        handleMove={this.handleMove}
        legalMoves={legalMoves}
        gameId={GAME_ID}
      />
    );
  }

  render() {
    const { players } = this.state;

    return (
      <Wrapper className="Game">
        { this.renderBoardOrLoading() }
        <SidebarWrapper>
          <GameInfo
            activePlayer={this.activePlayer()}
            userColor={this.getUserColor()}
            players={players}
          />
          <LoginForm setUsername={this.setUsername} />
          { this.renderMoves() }
        </SidebarWrapper>
      </Wrapper>
    );
  }
}

export default Game;
