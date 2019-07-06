import React, { Component } from 'react';
import styled from '@emotion/styled';
import update from 'immutability-helper';
import Board from './Board/Board';
import MoveHistory from './Move/MoveHistory';
import GameInfo from './GameInfo';
import LoginForm from '../LoginForm/LoginForm';
import XiangqiBoard, { RefType } from '../logic';
import { getGame, getMoves, getLastUpdate } from '../client';

const GAME_ID = 'ABC123';
const POLL_INTERVAL = 2500;

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
  width: 250px;
`;

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePlayerIdx: 0,
      players: [],
      moves: [],
      selectedMoveIdx: null,
      selectedSlot: null,
      username: null,
      clientUpdatedAt: null,
      timer: null,
    };

    this.changePlayer = this.changePlayer.bind(this);
    this.handleLegalMove = this.handleLegalMove.bind(this);
    this.handleMoveSelect = this.handleMoveSelect.bind(this);
    this.handleSquareSelect = this.handleSquareSelect.bind(this);
    this.fetchGame = this.fetchGame.bind(this);
    this.setUsername = this.setUsername.bind(this);
  }

  componentDidMount() {
    this.fetchGame();
  }

  componentWillUnmount() {
    this.setState({ timer: null });
  }

  // TODO: only poll for move update? Can't do that now because
  // we don't update active player based on moves
  pollForGameUpdate() {
    // Use current fen instead?
    const { username, clientUpdatedAt } = this.state;
    if (username === null || username === this.activePlayer.name) return;

    getLastUpdate(GAME_ID)
      .then((response) => {
        const { data: { updated_at: serverUpdatedAt } } = response;
        if ((clientUpdatedAt === null && serverUpdatedAt !== null)
          || (clientUpdatedAt < serverUpdatedAt)) {
          this.fetchGame();
          this.stopPolling();
          this.setState({ clientUpdatedAt: serverUpdatedAt });
        }
      });
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
      this.setState({ moves, selectedMoveIdx: moves.length - 1 });
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

      this.startPolling();
      this.handleSquareSelect({ slot: null });
    });
  }

  handleLegalMove(fromSlot, toSlot) {
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
        selectedMoveIdx: moves.length,
      };
    });
    this.changePlayer();
    this.startPolling();
  }

  startPolling() {
    const { username } = this.state;
    const { name } = this.activePlayer();
    if (name === username) return;

    this.setState({
      timer: setInterval(() => this.pollForGameUpdate(), POLL_INTERVAL),
    });
  }

  stopPolling() {
    this.setState((fromState) => {
      const { timer } = fromState;
      clearInterval(timer);
      return { timer: null };
    });
  }

  handleMoveSelect({ idx }) {
    this.setState({ selectedMoveIdx: idx });
  }

  handleSquareSelect({ slot }) {
    this.setState({ selectedSlot: slot === null ? undefined : slot });
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
    const { moves, selectedMoveIdx } = this.state;
    return (
      <MoveHistory
        moves={moves}
        selectedIdx={selectedMoveIdx}
        handleMoveSelect={this.handleMoveSelect}
      />
    );
  }

  renderBoardOrLoading() {
    const { moves, selectedMoveIdx, selectedSlot } = this.state;
    const userColor = this.getUserColor();

    if (moves.length === 0) return (<div><p>Loading...</p></div>);

    const { board, piece } = moves[selectedMoveIdx];
    const nextMoveColor = board.isRedCode(piece) ? 'black' : 'red';

    const legalMoves = board
      .legalMovesByColor(nextMoveColor)
      .map(
        (toSlots) => (selectedMoveIdx === moves.length - 1 ? toSlots : []),
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
        handleLegalMove={this.handleLegalMove}
        handleSelect={this.handleSquareSelect}
        legalMoves={legalMoves}
        selectedSlot={selectedSlot}
        gameId={GAME_ID}
      />
    );
  }

  render() {
    const { moves, players } = this.state;

    if (moves.length === 0) return (<div><p>Loading...</p></div>);

    // TODO: smell -- repeat code
    const { board: latestBoard } = moves[moves.length - 1];

    return (
      <Wrapper className="Game">
        { this.renderBoardOrLoading() }
        <SidebarWrapper>
          <LoginForm setUsername={this.setUsername} />
          <GameInfo
            activePlayer={this.activePlayer()}
            userColor={this.getUserColor()}
            players={players}
            latestBoard={latestBoard}
          />
          { this.renderMoves() }
        </SidebarWrapper>
      </Wrapper>
    );
  }
}

export default Game;
