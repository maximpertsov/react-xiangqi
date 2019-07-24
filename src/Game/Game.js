/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { Component, useState, useEffect } from 'react';
import Board from './Board/Board';
import { selectMove, getNextMoveColor, getNextMovePlayer } from './utils';
import MoveHistory from './Move/MoveHistory';
import GameInfo from './GameInfo';
import LoginForm from '../LoginForm/LoginForm';
import XiangqiBoard, { RefType } from '../logic';
import * as client from '../client';

const POLL_INTERVAL = 2500;
// TODO: define in logic class
/* eslint-disable-next-line max-len */
const DEFAULT_FEN = 'rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR';

const getInitialMoves = (fen = DEFAULT_FEN) => [
  {
    piece: undefined,
    fromPos: undefined,
    toPos: undefined,
    board: new XiangqiBoard({ fen }),
  },
];

const initialPlayers = [
  { name: undefined, color: 'red' },
  { name: undefined, color: 'black' },
];

const PureGame = ({ gameSlug }) => {
  const [clientUpdatedAt, setClientUpdatedAt] = useState(null);
  const [moves, setMoves] = useState(getInitialMoves());
  const [players, setPlayers] = useState(initialPlayers);
  const [selectedMoveIdx, setSelectedMoveIdx] = useState(0);
  const [timer, setTimer] = useState(null);
  const [username, setUsername] = useState(null);

  // Fetch data utilities

  const fetchMoves = (fen) => {
    client.getMoves(gameSlug).then((response) => {
      const { moves: movesData } = response.data;
      const _moves = getInitialMoves(fen);
      movesData.reduce(
        (lastBoard, moveData) => {
          const { piece, origin: fromPos, destination: toPos } = moveData;
          const board = lastBoard.move(fromPos, toPos, RefType.RANK_FILE);
          const move = {
            piece, fromPos, toPos, board,
          };
          _moves.push(move);
          return move.board;
        },
        _moves[0].board,
      );
      // TODO: There is one more board than moves.
      // Watch out for off by 1 errors!
      setMoves(_moves);
      setSelectedMoveIdx(_moves.length - 1);
    });
  };

  const fetchGame = () => {
    if (gameSlug === undefined) {
      setMoves(getInitialMoves());
      setSelectedMoveIdx(0);
      return;
    }

    client.getGame(gameSlug).then((response) => {
      const { players: _players, initial_fen: fen } = response.data;
      setPlayers(_players);
      fetchMoves(fen);
    });
  };

  // Polling utilities

  const stopPolling = () => {
    clearInterval(timer);
    setTimer(null);
  };

  // TODO: only poll for move update? Can't do that now because
  // we don't update active player based on moves
  const pollForGameUpdate = () => {
    // TODO: Use current fen instead?
    const { name: nextMovePlayerName } = getNextMovePlayer(players);
    if (username === null || username === nextMovePlayerName) {
      stopPolling();
      return;
    }

    if (gameSlug === undefined) return;

    client.getLastUpdate(gameSlug)
      .then((response) => {
        const { data: { updated_at: serverUpdatedAt } } = response;
        if ((clientUpdatedAt === null && serverUpdatedAt !== null)
          || (clientUpdatedAt < serverUpdatedAt)) {
          fetchGame();
          stopPolling();
          setClientUpdatedAt(serverUpdatedAt);
        }
      });
  };

  const startPolling = () => {
    setTimer(setInterval(() => pollForGameUpdate(), POLL_INTERVAL));
  };

  // Lifecycle methods

  useEffect(
    () => {
      // will mount
      fetchGame();
      startPolling();
      // will unmount
      return () => { setTimer(null); };
    },
    [gameSlug],
  );

  // Move updates

  const getPostMovePayload = (board, fromSlot, toSlot) => {
    const { name: player } = getNextMovePlayer(players, moves);
    const fromPos = board.getRankFile(fromSlot);
    const toPos = board.getRankFile(toSlot);
    const piece = board.getPiece(fromSlot);
    return {
      player, piece, fromPos, toPos,
    };
  };

  const postMoveToServer = (board, fromSlot, toSlot) => {
    if (gameSlug === undefined) return;

    const payload = getPostMovePayload(board, fromSlot, toSlot);
    client
      .postMove(gameSlug, payload)
      .then(({ status }) => {
        if (status !== 201) {
          fetchGame();
          startPolling();
        }
      })
      .catch(() => {
        // TODO: display useful error?
        fetchGame();
      });
  };

  const handleLegalMove = (board, fromSlot, toSlot) => {
    setMoves((fromMoves) => {
      const nextMove = {
        fromPos: board.getRankFile(fromSlot),
        toPos: board.getRankFile(toSlot),
        piece: board.getPiece(fromSlot),
        board: board.move(fromSlot, toSlot),
      };
      return update(fromMoves, { $push: [nextMove] });
    });
    setSelectedMoveIdx(moves.length);

    postMoveToServer(board, fromSlot, toSlot);
  };

  const handleMoveSelect = ({ idx }) => {
    setSelectedMoveIdx(idx);
  };

  const getUserPlayer = () => players.find((p) => p.name === username) || {};

  const getUserColor = () => getUserPlayer().color;

  const setUsernameAndPoll = (name) => {
    setUsername(name);
    startPolling();
  };

  // TODO: add a state that allows players to flip their original orientation
  const getInitialUserOrientation = () => getUserColor() === 'black';

  const getLegalMoves = (idx, currentUserOnly = true) => {
    const nextMoveColor = getNextMoveColor();
    const userColor = getUserColor();
    const { board } = selectMove(moves, idx);
    const selectUserMoves = currentUserOnly && gameSlug !== undefined;

    return board
      .legalMoves()
      .map((toSlots, fromSlot) => {
        if (idx !== -1 && idx !== moves.length - 1) return [];
        if (!board.isColor(nextMoveColor, fromSlot)) return [];
        if (selectUserMoves && !board.isColor(userColor, fromSlot)) return [];
        return toSlots;
      });
  };

  return (
    <div
      className="Game"
      css={css`
          display: flex;
          align-items: center;
          @media (max-width: 720px) {
            flex-direction: column;
          }
          @media (min-width: 720px) {
            flex-direction: row;
          }
          height: 600px;
        `}
    >
      <Board
        nextMoveColor={getNextMoveColor()}
        board={selectMove(moves, selectedMoveIdx).board}
        handleLegalMove={handleLegalMove}
        legalMoves={getLegalMoves(selectedMoveIdx)}
        reversed={getInitialUserOrientation()}
      />
      <div
        css={css`
            justify-content: space-between;
            flex-direction: column;
            padding: 0px 50px;
            height: 100%;
            max-width: 250px;
            @media (max-width: 720px) {
              display: none;
            }
            @media (min-width: 720px) {
              display: flex;
            }
          `}
      >
        <LoginForm setUsername={setUsernameAndPoll} />
        <GameInfo
          activePlayer={getNextMovePlayer()}
          userColor={getUserColor()}
          players={players}
          activeLegalMoves={getLegalMoves(-1, false)}
        />
        <MoveHistory
          moves={moves}
          selectedIdx={selectedMoveIdx}
          handleMoveSelect={handleMoveSelect}
        />
      </div>
    </div>
  );
};

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
        { name: undefined, color: 'red' },
        { name: undefined, color: 'black' },
      ],
      selectedMoveIdx: 0,
      /* eslint-disable-next-line react/no-unused-state */
      timer: null,
      username: null,
    };

    this.handleLegalMove = this.handleLegalMove.bind(this);
    this.handleMoveSelect = this.handleMoveSelect.bind(this);
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
    if (gameSlug === undefined) return;

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
    if (gameSlug === undefined) {
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
    if (gameSlug === undefined) return;

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

  getLegalMoves(idx, currentUserOnly = true) {
    const { gameSlug } = this.props;
    const { moves } = this.state;
    const nextMoveColor = this.getNextMoveColor();
    const userColor = this.getUserColor();
    const { board } = selectMove(moves, idx);
    const selectUserMoves = currentUserOnly && gameSlug !== undefined;

    return board
      .legalMoves()
      .map((toSlots, fromSlot) => {
        if (idx !== -1 && idx !== moves.length - 1) return [];
        if (!board.isColor(nextMoveColor, fromSlot)) return [];
        if (selectUserMoves && !board.isColor(userColor, fromSlot)) return [];
        return toSlots;
      });
  }

  render() {
    const { moves, selectedMoveIdx, players } = this.state;

    return (
      <div
        className="Game"
        css={css`
          display: flex;
          align-items: center;
          @media (max-width: 720px) {
            flex-direction: column;
          }
          @media (min-width: 720px) {
            flex-direction: row;
          }
          height: 600px;
        `}
      >
        <Board
          nextMoveColor={this.getNextMoveColor()}
          board={selectMove(moves, selectedMoveIdx).board}
          handleLegalMove={this.handleLegalMove}
          legalMoves={this.getLegalMoves(selectedMoveIdx)}
          reversed={this.getInitialUserOrientation()}
        />
        <div
          css={css`
            justify-content: space-between;
            flex-direction: column;
            padding: 0px 50px;
            height: 100%;
            max-width: 250px;
            @media (max-width: 720px) {
              display: none;
            }
            @media (min-width: 720px) {
              display: flex;
            }
          `}
        >
          <LoginForm setUsername={this.setUsername} />
          <GameInfo
            activePlayer={this.getNextMovePlayer()}
            userColor={this.getUserColor()}
            players={players}
            activeLegalMoves={this.getLegalMoves(-1, false)}
          />
          <MoveHistory
            moves={moves}
            selectedIdx={selectedMoveIdx}
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
  gameSlug: undefined,
};

export default Game;
