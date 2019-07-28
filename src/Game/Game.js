/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';
import update from 'immutability-helper';
import {
  useCallback, useReducer, useState, useEffect,
} from 'react';
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

const addMove = (state, { piece, origin: fromPos, destination: toPos }) => {
  const { board } = state[state.length - 1];
  const newMove = {
    piece,
    fromPos,
    toPos,
    board: board.move(fromPos, toPos, RefType.RANK_FILE),
  };
  return update(state, { $push: [newMove] });
};

const addMoveToBoard = (state, board, { fromSlot, toSlot }) => {
  const newMove = {
    fromPos: board.getRankFile(fromSlot),
    toPos: board.getRankFile(toSlot),
    piece: board.getPiece(fromSlot),
    board: board.move(fromSlot, toSlot),
  };
  return update(state, { $push: [newMove] });
};

const addMoves = (state, moves) => moves.reduce(
  (prevState, move) => addMove(prevState, move),
  state,
);

const reduceMoves = (state, action) => {
  switch (action.type) {
    case 'add_move':
      return addMove(state, action.move);
    case 'add_move_to_board':
      return addMoveToBoard(state, action.board, action.move);
    case 'add_moves':
      // TODO: make it clear that you are reseting here!
      return addMoves(getInitialMoves(), action.moves);
    default:
      return state;
  }
};

const Game = ({ gameSlug }) => {
  const [clientUpdatedAt, setClientUpdatedAt] = useState(null);
  // const [moves, setMoves] = useState(getInitialMoves());
  const [moves, dispatchMoves] = useReducer(reduceMoves, DEFAULT_FEN, getInitialMoves);
  const [players, setPlayers] = useState(initialPlayers);
  const [selectedMoveIdx, setSelectedMoveIdx] = useState(0);
  const [username, setUsername] = useState(null);

  // Fetch data utilities

  const fetchMoves = useCallback(
    // TODO: incorporate fen
    // see: https://reactjs.org/docs/hooks-reference.html#lazy-initialization
    (fen) => {
      client.getMoves(gameSlug).then((response) => {
        const { moves: movesData } = response.data;
        dispatchMoves({ type: 'add_moves', moves: movesData });
        setSelectedMoveIdx(movesData.length);
      });
    },
    [gameSlug],
  );

  const fetchGame = useCallback(
    () => {
      if (gameSlug === undefined) {
        dispatchMoves({ type: 'addMoves', moves: [] });
        setSelectedMoveIdx(0);
        return;
      }

      client.getGame(gameSlug).then((response) => {
        const { players: _players, initial_fen: fen } = response.data;
        setPlayers(_players);
        fetchMoves(fen);
      });
    },
    [fetchMoves, gameSlug],
  );

  // TODO: only poll for move update? Can't do that now because
  // we don't update active player based on moves
  const pollForGameUpdate = useCallback(
    () => {
      if (gameSlug === undefined) return;
      if (username === null) return;
      if (clientUpdatedAt === null) return;

      const { name: nextMovePlayerName } = getNextMovePlayer(players, moves);
      if (username === nextMovePlayerName) return;

      client.getLastUpdate(gameSlug)
        .then((response) => {
          const { data: { updated_at: serverUpdatedAt } } = response;
          if (serverUpdatedAt === null) return;
          if (clientUpdatedAt >= serverUpdatedAt) return;

          fetchGame();
          setClientUpdatedAt(serverUpdatedAt);
        });
    },
    [clientUpdatedAt, fetchGame, gameSlug, moves, players, username],
  );

  // Lifecycle methods

  useEffect(
    () => {
      fetchGame();
      // HACK to make sure we have at least one refresh!
      setClientUpdatedAt(1);
    },
    [fetchGame, gameSlug],
  );

  useEffect(
    () => {
      const interval = setInterval(() => pollForGameUpdate(), POLL_INTERVAL);
      return () => clearInterval(interval);
    },
    [gameSlug, pollForGameUpdate],
  );

  // Move updates

  const getPostMovePayload = useCallback(
    (board, fromSlot, toSlot) => {
      const { name: player } = getNextMovePlayer(players, moves);
      const fromPos = board.getRankFile(fromSlot);
      const toPos = board.getRankFile(toSlot);
      const piece = board.getPiece(fromSlot);
      return {
        player, piece, fromPos, toPos,
      };
    },
    [moves, players],
  );

  const postMoveToServer = useCallback(
    (board, fromSlot, toSlot) => {
      if (gameSlug === undefined) return;

      const payload = getPostMovePayload(board, fromSlot, toSlot);
      client
        .postMove(gameSlug, payload)
        .then(({ status }) => {
          if (status !== 201) fetchGame();
        })
        .catch(() => {
        // TODO: display useful error?
          fetchGame();
        });
    },
    [fetchGame, gameSlug, getPostMovePayload],
  );

  const handleLegalMove = useCallback(
    (board, fromSlot, toSlot) => {
      dispatchMoves({
        type: 'add_move_to_board',
        board,
        move: { fromSlot, toSlot },
      });
      setSelectedMoveIdx(moves.length);

      postMoveToServer(board, fromSlot, toSlot);
    },
    [moves.length, postMoveToServer],
  );

  const handleMoveSelect = ({ idx }) => {
    setSelectedMoveIdx(idx);
  };

  const getUserPlayer = () => players.find((p) => p.name === username) || {};

  const getUserColor = () => getUserPlayer().color;

  // TODO: add a state that allows players to flip their original orientation
  const getInitialUserOrientation = () => getUserColor() === 'black';

  const getLegalMoves = (idx, currentUserOnly = true) => {
    const nextMoveColor = getNextMoveColor(moves);
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
        nextMoveColor={getNextMoveColor(moves)}
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
        <LoginForm setUsername={setUsername} />
        <GameInfo
          activePlayer={getNextMovePlayer(players, moves)}
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

Game.propTypes = {
  gameSlug: PropTypes.string,
};

Game.defaultProps = {
  gameSlug: undefined,
};

export default Game;
