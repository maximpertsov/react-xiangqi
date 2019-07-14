/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Board from './Board/Board';
import MoveHistory from './Move/MoveHistory';
import GameInfo from './GameInfo';
import LoginForm from '../LoginForm/LoginForm';
import XiangqiBoard, { RefType } from '../logic';
import * as client from '../client';

const POLL_INTERVAL = 2500;
// TODO: define in logic class
/* eslint-disable-next-line max-len */
const DEFAULT_FEN = 'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clientUpdatedAt: null,
      moves: [
        {
          piece: undefined,
          fromPos: undefined,
          toPos: undefined,
          board: new XiangqiBoard(),
        },
      ],
      players: [
        // TODO: allow for same display name?
        { name: '', color: 'red' },
        { name: ' ', color: 'black' },
      ],
      selectedMoveIdx: 0,
      selectedSlot: null,
      /* eslint-disable-next-line react/no-unused-state */
      timer: null,
      username: null,
    };

    this.handleLegalMove = this.handleLegalMove.bind(this);
    this.handleMoveSelect = this.handleMoveSelect.bind(this);
    this.handleSquareSelect = this.handleSquareSelect.bind(this);
    this.setUsername = this.setUsername.bind(this);
  }

  componentDidMount() {
    this.fetchGame();
  }

  componentWillUnmount() {
    /* eslint-disable-next-line react/no-unused-state */
    this.setState({ timer: null });
  }

  // TODO: only poll for move update? Can't do that now because
  // we don't update active player based on moves
  pollForGameUpdate() {
    // TODO: Use current fen instead?
    const { username, clientUpdatedAt } = this.state;
    const { name: nextMovePlayerName } = this.getNextMovePlayer();
    if (username === null || username === nextMovePlayerName) {
      this.stopPolling();
      return;
    }

    const { gameSlug } = this.props;
    if (gameSlug === null) return;

    client.getLastUpdate(gameSlug)
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
    const { gameSlug } = this.props;
    client.getMoves(gameSlug).then((response) => {
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
    const { gameSlug } = this.props;
    if (gameSlug === null) {
      this.setState({
        moves: [{
          piece: undefined,
          fromPos: undefined,
          toPos: undefined,
          board: new XiangqiBoard({ fen: DEFAULT_FEN }),
        }],
        selectedMoveIdx: 0,
      });

      return;
    }

    client.getGame(gameSlug).then((response) => {
      const { players, initial_fen: fen } = response.data;
      this.setState({ players });
      this.fetchMoves(fen);

      this.startPolling();
      this.handleSquareSelect({ slot: null });
    });
  }

  handleLegalMove(board, fromSlot, toSlot) {
    this.setState((fromState) => {
      const { moves } = fromState;
      const nextMove = {
        fromPos: board.getRankFile(fromSlot),
        toPos: board.getRankFile(toSlot),
        piece: board.getPiece(fromSlot),
        board: board.move(fromSlot, toSlot),
      };
      return {
        // TODO: can there be an inconsistency if function receives
        // a board other than the most recent board?
        moves: update(moves, { $push: [nextMove] }),
        selectedMoveIdx: moves.length,
      };
    });

    this.postMoveToServer(board, fromSlot, toSlot);
  }

  getPostMovePayload(board, fromSlot, toSlot) {
    const { name: player } = this.getNextMovePlayer();
    const fromPos = board.getRankFile(fromSlot);
    const toPos = board.getRankFile(toSlot);
    const piece = board.getPiece(fromSlot);
    return {
      player, piece, fromPos, toPos,
    };
  }

  postMoveToServer(board, fromSlot, toSlot) {
    const { gameSlug } = this.props;
    if (gameSlug === null) return;

    client.postMove(gameSlug, this.getPostMovePayload(board, fromSlot, toSlot))
      .then(({ status }) => {
        if (status !== 201) {
          this.fetchGame();
          this.startPolling();
        }
      })
      .catch(() => {
        // TODO: display useful error?
        this.fetchGame();
      });
  }

  startPolling() {
    this.setState({
      /* eslint-disable-next-line react/no-unused-state */
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

  getNextMoveColor() {
    const { moves } = this.state;
    if (moves.length === 0) return 'red';

    // TODO: we don't really need a specific board for this function
    const { piece: lastMovedPiece, board } = moves[moves.length - 1];

    return board.isRedCode(lastMovedPiece) ? 'black' : 'red';
  }

  // TODO: create PlayerManager class?
  getNextMovePlayer() {
    const { players } = this.state;
    const nextMoveColor = this.getNextMoveColor();

    return players.find((p) => p.color === nextMoveColor);
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
    this.startPolling();
  }

  // TODO: add a state that allows players to flip their original orientation
  getInitialUserOrientation() {
    if (this.getUserColor() === 'black') return true;
    return false;
  }

  renderBoardOrLoading() {
    const { moves, selectedMoveIdx, selectedSlot } = this.state;
    const { gameSlug } = this.props;

    const nextMoveColor = this.getNextMoveColor();
    const userColor = this.getUserColor();

    if (moves.length === 0) return (<div><p>Loading...</p></div>);

    const { board } = moves[selectedMoveIdx];

    const legalMoves = board
      .legalMoves()
      .map((toSlots, fromSlot) => {
        if (selectedMoveIdx !== moves.length - 1) return [];
        if (!board.isColor(nextMoveColor, fromSlot)) return [];
        if (gameSlug !== null && !board.isColor(userColor, fromSlot)) return [];
        return toSlots;
      });

    return (
      <Board
        nextMoveColor={nextMoveColor}
        board={board}
        handleLegalMove={this.handleLegalMove}
        handleSelect={this.handleSquareSelect}
        legalMoves={legalMoves}
        reversed={this.getInitialUserOrientation()}
        selectedSlot={selectedSlot}
      />
    );
  }

  renderGameInfo() {
    const { gameSlug } = this.props;
    if (gameSlug === null) return null;

    const { moves, players } = this.state;

    if (moves.length === 0) return (<div><p>Loading...</p></div>);

    // TODO: smell -- repeat code
    const { board: latestBoard } = moves[moves.length - 1];

    return (
      <GameInfo
        activePlayer={this.getNextMovePlayer()}
        userColor={this.getUserColor()}
        players={players}
        latestBoard={latestBoard}
      />
    );
  }

  render() {
    return (
      <div
        className="Game"
        css={css`
          display: flex;
          justify-content: center;
          flex-direction: row;
          height: 600px;
        `}
      >
        { this.renderBoardOrLoading() }
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            padding: 0px 50px;
            height: 100%;
            width: 250px;
          `}
        >
          <LoginForm setUsername={this.setUsername} />
          { this.renderGameInfo() }
          <MoveHistory
            moves={this.state.moves}
            selectedIdx={this.state.selectedMoveIdx}
            handleMoveSelect={this.handleMoveSelect}
          />
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  gameSlug: PropTypes.string,
};

Game.defaultProps = {
  gameSlug: null,
};

export default Game;
