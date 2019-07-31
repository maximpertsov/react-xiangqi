/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';
import useGameReducer from './reducers';
import Board from './Board/Board';
import { getMove, getNextMoveColor, getNextMovePlayer } from './utils';
import MoveHistory from './Move/MoveHistory';
import GameInfo from './GameInfo';
import LoginForm from '../LoginForm/LoginForm';
import * as client from '../client';

const POLL_INTERVAL = 2500;

const Game = ({ gameSlug }) => {
  const [state, dispatch] = useGameReducer();
  const [clientUpdatedAt, setClientUpdatedAt] = useState(null);
  const [username, setUsername] = useState(null);

  // Fetch data utilities

  const fetchMoves = useCallback(
    () => {
      if (gameSlug === undefined) {
        dispatch({ type: 'set_moves', moves: [] });
        return;
      }

      client.getMoves(gameSlug).then((response) => {
        dispatch({ type: 'set_moves', moves: response.data.moves });
      });
    },
    [dispatch, gameSlug],
  );

  const fetchGame = useCallback(
    () => {
      if (gameSlug === undefined) return;

      client.getGame(gameSlug).then((response) => {
        dispatch({ type: 'set_players', players: response.data.players });
      });
    },
    [dispatch, gameSlug],
  );

  // TODO: only poll for move update? Can't do that now because
  // we don't update active player based on moves
  const pollForMoveUpdate = useCallback(
    () => {
      if (gameSlug === undefined) return;
      if (username === null) return;
      if (clientUpdatedAt === null) return;
      if (username === getNextMovePlayer(state.players, state.moves)) return;

      client.getLastUpdate(gameSlug)
        .then((response) => {
          const { data: { updated_at: serverUpdatedAt } } = response;
          if (serverUpdatedAt === null) return;
          if (clientUpdatedAt >= serverUpdatedAt) return;

          fetchMoves();
          setClientUpdatedAt(serverUpdatedAt);
        });
    },
    [
      clientUpdatedAt,
      fetchMoves,
      gameSlug,
      state.moves,
      state.players,
      username,
    ],
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
      const interval = setInterval(() => pollForMoveUpdate(), POLL_INTERVAL);
      return () => clearInterval(interval);
    },
    [gameSlug, pollForMoveUpdate],
  );

  // Move updates

  const getPostMovePayload = useCallback(
    (board, fromSlot, toSlot) => {
      const { name: player } = getNextMovePlayer(state.players, state.moves);
      const fromPos = board.getRankFile(fromSlot);
      const toPos = board.getRankFile(toSlot);
      const piece = board.getPiece(fromSlot);
      return {
        player, piece, fromPos, toPos,
      };
    },
    [state.moves, state.players],
  );

  const postMoveToServer = useCallback(
    (board, fromSlot, toSlot) => {
      if (gameSlug === undefined) return;

      const payload = getPostMovePayload(board, fromSlot, toSlot);
      client
        .postMove(gameSlug, payload)
        .then(({ status }) => {
          if (status !== 201) fetchMoves();
        })
        .catch(() => {
        // TODO: display useful error?
          fetchMoves();
        });
    },
    [fetchMoves, gameSlug, getPostMovePayload],
  );

  const handleLegalMove = useCallback(
    (board, fromSlot, toSlot) => {
      dispatch({
        type: 'add_move',
        board,
        move: { fromSlot, toSlot },
      });

      postMoveToServer(board, fromSlot, toSlot);
    },
    [dispatch, postMoveToServer],
  );

  const handleMoveSelect = ({ idx }) => {
    dispatch({ type: 'select_move', index: idx });
  };

  const getUserPlayer = () => (
    state.players.find((p) => p.name === username) || {}
  );

  const getUserColor = () => getUserPlayer().color;

  // TODO: add a state that allows players to flip their original orientation
  const getInitialUserOrientation = () => getUserColor() === 'black';

  const getLegalMoves = (idx, currentUserOnly = true) => {
    const nextMoveColor = getNextMoveColor(state.moves);
    const userColor = getUserColor();
    const { board } = getMove(state.moves, idx);
    const selectUserMoves = currentUserOnly && gameSlug !== undefined;

    return board
      .legalMoves()
      .map((toSlots, fromSlot) => {
        if (idx !== -1 && idx !== state.moves.length - 1) return [];
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
        nextMoveColor={getNextMoveColor(state.moves)}
        board={selectMove(state.moves, state.selectedMoveIdx).board}
        handleLegalMove={handleLegalMove}
        legalMoves={getLegalMoves(state.selectedMoveIdx)}
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
          activePlayer={getNextMovePlayer(state.players, state.moves)}
          userColor={getUserColor()}
          players={state.players}
          activeLegalMoves={getLegalMoves(-1, false)}
        />
        <MoveHistory
          moves={state.moves}
          selectedIdx={state.selectedMoveIdx}
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
