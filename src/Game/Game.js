/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import useGameReducer from './reducers';
import Board from './Board/Board';
import MoveHistory from './Move/MoveHistory';
import GameInfo from './GameInfo';
import * as client from '../client';
import * as selectors from './selectors';

const POLL_INTERVAL = 2500;

const Game = ({ gameSlug, username }) => {
  const [state, dispatch] = useGameReducer();

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
      if (username === undefined) return;
      if (username === selectors.getNextMovePlayer(state)) return;

      client.getMoveCount(gameSlug)
        .then((response) => {
          const { data: { move_count: moveCount } } = response;
          if (!state.loading && state.moveCount >= moveCount) return;
          fetchMoves();
        });
    },
    [fetchMoves, gameSlug, state, username],
  );

  // Lifecycle methods

  useEffect(
    () => { fetchGame(); },
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

  const postMoveToServer = useCallback(
    (board, fromSlot, toSlot) => {
      if (gameSlug === undefined) return;

      client
        .postMove(gameSlug, {
          username, board, fromSlot, toSlot,
        })
        .then(({ status }) => {
          if (status !== 201) fetchMoves();
        })
        .catch(() => {
        // TODO: display useful error?
          fetchMoves();
        });
    },
    [fetchMoves, gameSlug, username],
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

  // TODO: add a state that allows players to flip their original orientation
  const getInitialUserOrientation = () => (
    selectors.getUserColor(state, username) === 'black'
  );

  const getLegalMoves = (idx, currentUserOnly = true) => {
    const nextMoveColor = selectors.getNextMoveColor(state);
    const userColor = selectors.getUserColor(state, username);
    const { board } = selectors.getMove(state, idx);
    const selectUserMoves = currentUserOnly && gameSlug !== undefined;

    return board
      .legalMoves()
      .map((toSlots, fromSlot) => {
        if (idx !== state.moves.length - 1) return [];
        if (!board.isColor(nextMoveColor, fromSlot)) return [];
        if (selectUserMoves && !board.isColor(userColor, fromSlot)) return [];
        return toSlots;
      });
  };

  if (gameSlug !== undefined && state.loading) return <div>Loading...</div>;

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
        nextMoveColor={selectors.getNextMoveColor(state)}
        board={selectors.getMove(state, state.selectedMoveIdx).board}
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
            width: 200px;
            @media (max-width: 720px) {
              display: none;
            }
            @media (min-width: 720px) {
              display: flex;
            }
          `}
      >
        <GameInfo
          activePlayer={selectors.getNextMovePlayer(state)}
          userColor={selectors.getUserColor(state, username)}
          players={state.players}
          activeLegalMoves={getLegalMoves(state.moves.length - 1, false)}
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
  username: PropTypes.string,
};

Game.defaultProps = {
  gameSlug: undefined,
  username: undefined,
};

export default Game;
