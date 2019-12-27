/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import { useCallback, useEffect } from 'react';
import useEventListener from '@use-it/event-listener';

import Player from './Player/Player';
import useGameReducer from './reducers';
import Board from '../../components/Board';
import MoveHistory from './Move/MoveHistory';
import GameInfo from './GameInfo';
import ConfirmMenu from './ConfirmMenu';
import * as client from '../../client';
import { Color } from '../../logic/constants';
import { getSlot } from '../../logic/utils';
import * as selectors from './selectors';
import { AutoMove } from '../../constants';

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

  useEffect(
    () => {
      const nextMoveColor = selectors.getNextMoveColor(state);
      if (autoMove === AutoMove.BOTH || autoMove === nextMoveColor) {
        const { board } = selectors.getLastMove(state);
        const [fromSlot, toSlot] = board.randomMove(nextMoveColor);
        dispatch({
          type: 'add_move', board, fromSlot, toSlot, pending: false,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoMove, dispatch, state.moves],
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
    async({ fromPos, toPos }) => {
      if (gameSlug === undefined) return;

      try {
        const { status } = await client.postMove(gameSlug, {
          username, fromPos, toPos,
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
      dispatch({
        type: 'add_move', board, fromSlot, toSlot, pending: true,
      });
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

      await postMoveToServer(lastMove);
      dispatch({ type: 'confirm_moves' });
    },
    [dispatch, postMoveToServer, state],
  );

  const handleMoveSelect = ({ idx }) => {
    dispatch({ type: 'select_move', index: idx });
  };

  // TODO: add a state that allows players to flip their original orientation
  const getInitialUserOrientation = () => selectors
    .getUserColor(state, username) === Color.BLACK;

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

  const active = gameSlug !== undefined && state.loading;

  // TODO: just pass selectedMove down instead of the board and move separately?
  const {
    board: selectedBoard,
    fromPos,
    toPos,
  } = selectors.getMove(state, state.selectedMoveIdx);
  const lastMoveOnSelectedBoard = {
    fromSlot: fromPos === undefined ? undefined : getSlot(...fromPos),
    toSlot: toPos === undefined ? undefined : getSlot(...toPos),
  };

  return (
    <Dimmer.Dimmable
      as={Segment}
      basic
      blurring
      dimmed={active}
      className="Game"
      css={css`
          align-items: center;
          display: flex;
          flex-direction: column;
          height: 100%;
        `}
    >
      <Dimmer
        active={active}
        page
      >
        <Loader>Loading</Loader>
      </Dimmer>
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
          board={selectedBoard}
          nextMoveColor={selectors.getNextMoveColor(state)}
          handleLegalMove={handleLegalMove}
          lastMove={lastMoveOnSelectedBoard}
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
    </Dimmer.Dimmable>
  );
};

Game.propTypes = {
  autoMove: PropTypes.oneOf([undefined, ...Object.values(AutoMove)]),
  gameSlug: PropTypes.string,
  username: PropTypes.string,
};

Game.defaultProps = {
  autoMove: undefined,
  gameSlug: undefined,
  username: undefined,
};

export default Game;
