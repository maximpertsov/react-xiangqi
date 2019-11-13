/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';

import { useCallback, useEffect } from 'react';
import useEventListener from '@use-it/event-listener';

import Player from './Player/Player';
import useGameReducer from './reducers';
import Board from './Board/Board';
import MoveHistory from './Move/MoveHistory';
import GameInfo from './GameInfo';
import ConfirmMenu from './ConfirmMenu';
import * as client from '../client';
import * as logic from '../logic';
import { Color } from '../logic/constants';
import * as selectors from './selectors';

const POLL_INTERVAL = 2500;

const Game = ({ autoMove, gameSlug, username }) => {
  const [state, dispatch] = useGameReducer();

  // Fetch data utilities

  const fetchMoves = useCallback(
    async() => {
      if (gameSlug === undefined) {
        dispatch({ type: 'set_moves', moves: [] });
        return;
      }

      const response = await client.getMoves(gameSlug);
      dispatch({ type: 'set_moves', moves: response.data.moves });
    },
    [dispatch, gameSlug],
  );

  const fetchGame = useCallback(
    async() => {
      if (gameSlug === undefined) return;

      const response = await client.getGame(gameSlug);
      dispatch({ type: 'set_players', players: response.data.players });
    },
    [dispatch, gameSlug],
  );

  const pollForMoveUpdate = useCallback(
    // eslint-disable-next-line complexity
    async() => {
      if (gameSlug === undefined) return;
      if (username === undefined) return;
      if (username === selectors.getNextMovePlayer(state)) return;

      const response = await client.getMoveCount(gameSlug);
      if (!state.loading && state.moveCount >= response.data.move_count) return;

      fetchMoves();
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

  useEventListener(
    'keydown',
    ({ key }) => {
      switch (key) {
        case 'ArrowLeft':
          dispatch({ type: 'select_previous_move' });
          break;
        case 'ArrowRight':
          dispatch({ type: 'select_next_move' });
          break;
        default:
          break;
      }
    },
  );

  // Move updates

  const postMoveToServer = useCallback(
    async(piece, fromPos, toPos) => {
      if (gameSlug === undefined) return;

      try {
        const { status } = await client.postMove(gameSlug, {
          username, piece, fromPos, toPos,
        });
        if (status !== 201) fetchMoves();
      } catch (error) {
        // TODO: display useful error?
        fetchMoves();
      }
    },
    [fetchMoves, gameSlug, username],
  );

  const handleLegalMove = useCallback(
    ({ board, fromSlot, toSlot }) => {
      dispatch({ type: 'add_move', board, move: { fromSlot, toSlot } });
    },
    [dispatch],
  );

  const cancelMove = useCallback(
    () => {
      dispatch({ type: 'cancelMoves' });
    },
    [dispatch],
  );

  const handleConfirmedMove = useCallback(
    async() => {
      const lastMove = selectors.getLastMove(state);
      if (!lastMove.pending) return;

      const { board, fromPos, toPos } = lastMove;
      const piece = board.getPiece(toPos, logic.RefType.RANK_FILE);

      await postMoveToServer(piece, fromPos, toPos);
      dispatch({ type: 'confirm_moves' });
    },
    [dispatch, postMoveToServer, state],
  );

  const handleMoveSelect = ({ idx }) => {
    dispatch({ type: 'select_move', index: idx });
  };

  // TODO: add a state that allows players to flip their original orientation
  const getInitialUserOrientation = () => (
    selectors.getUserColor(state, username) === 'black'
  );

  // TODO: move to layout class that displays board and players
  const getCurrentPlayer = () => {
    if (gameSlug === undefined) selectors.getRedPlayer(state);
    return selectors.getUserPlayer(state, username);
  };

  const getOtherPlayer = () => {
    if (gameSlug === undefined) selectors.getBlackPlayer(state);
    return selectors.getOtherPlayer(state, username);
  };

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
          flex-direction: column;
          height: 100%;
        `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-around;
          flex-direction: column;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex-direction: column;
          `}
        >
          <Player {...getOtherPlayer()} />
        </div>
        <Board
          autoMove={autoMove}
          nextMoveColor={selectors.getNextMoveColor(state)}
          board={selectors.getMove(state, state.selectedMoveIdx).board}
          handleLegalMove={handleLegalMove}
          legalMoves={getLegalMoves(state.selectedMoveIdx)}
          reversed={getInitialUserOrientation()}
        />
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex-direction: row;
          `}
        >
          <Player {...getCurrentPlayer()} />
          <GameInfo
            activePlayer={selectors.getNextMovePlayer(state)}
            userColor={selectors.getUserColor(state, username)}
            players={state.players}
            activeLegalMoves={getLegalMoves(state.moves.length - 1, false)}
          />
        </div>
        <ConfirmMenu
          yesHandler={handleConfirmedMove}
          noHandler={cancelMove}
          show={selectors.getLastMove(state).pending}
          disabled={gameSlug === undefined}
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
  autoMove: PropTypes.oneOf([undefined, Color.RED, Color.BLACK, 'both']),
  gameSlug: PropTypes.string,
  username: PropTypes.string,
};

Game.defaultProps = {
  autoMove: undefined,
  gameSlug: undefined,
  username: undefined,
};

export default Game;
