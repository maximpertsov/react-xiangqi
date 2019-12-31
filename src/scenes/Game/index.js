/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import { useCallback, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import useEventListener from '@use-it/event-listener';

import Board from 'components/Board';
import { getSlot } from 'services/logic/utils';

import ConfirmMenu from './components/ConfirmMenu';
import GameInfo from './components/GameInfo';
import MoveHistory from './components/MoveHistory';
import Player from './components/Player';
import * as client from './services/client';

import useGameReducer from './reducers';
import * as gameSelectors from './selectors';

// TODO: seems like this needs to be a relative import
// because it imports from services/logic/constants
import { AutoMove } from '../../constants';

const Game = ({ autoMove, gameSlug, username }) => {
  const [state, gameDispatch] = useGameReducer();
  const reduxDispatch = useDispatch();
  const selectors = useSelector(({ game }) => ({
    // moves
    lastMove: gameSelectors.getLastMove(game),
    selectedMove: gameSelectors.getSelectedMove(game),
    nextMoveColor: gameSelectors.getNextMoveColor(game),
    // players
    nextMovePlayer: gameSelectors.getNextMovePlayer(game),
    userColor: gameSelectors.getUserColor(game, { username }),
    otherPlayer: gameSelectors.getOtherPlayer(game, { gameSlug, username }),
    initialUserOrientation: gameSelectors.getInitialUserOrientation(
      game, { username }
    ),
    currentPlayer: gameSelectors.getCurrentPlayer(game, { gameSlug, username }),
    // game logic
    legalMoves: gameSelectors.getLegalMoves(game, { gameSlug, username }),
    hasLegalMoves: gameSelectors.hasLegalMoves(game),
    // other
    active: gameSlug !== undefined && game.loading,
  }), shallowEqual);

  const dispatch = useCallback(
    (params) => {
      gameDispatch(params);
      reduxDispatch(params);
    },
    [gameDispatch, reduxDispatch]
  );

  useEffect(
    () => {
      client.fetchGame({ dispatch, gameSlug });
    },
    [dispatch, gameSlug],
  );

  useEffect(
    () => {
      const interval = client.setPollMovesInterval({
        ...state,
        dispatch,
        gameSlug,
        nextMovePlayer: selectors.nextMovePlayer,
        username,
      });
      return () => clearInterval(interval);
    },
    [dispatch, gameSlug, selectors, state, username],
  );

  useEffect(
    () => {
      if (autoMove === AutoMove.BOTH || autoMove === selectors.nextMoveColor) {
        const { board } = selectors.lastMove;
        const [fromSlot, toSlot] = board.randomMove(selectors.nextMoveColor);
        dispatch({ type: 'add_move', board, fromSlot, toSlot, pending: false });
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

  const handleLegalMove = useCallback(
    ({ board, fromSlot, toSlot }) => {
      dispatch({ type: 'add_move', board, fromSlot, toSlot, pending: true });
    },
    [dispatch],
  );

  const cancelMove = useCallback(
    () => {
      dispatch({ type: 'cancel_moves' });
    },
    [dispatch],
  );

  const handleConfirmedMove = useCallback(
    async() => {
      const { fromPos, toPos, pending } = selectors.lastMove;
      if (!pending) return;

      await client.postMove({ dispatch, fromPos, toPos, gameSlug, username });
      dispatch({ type: 'confirm_moves' });
    },
    [dispatch, gameSlug, selectors, username],
  );

  const handleMoveSelect = ({ idx }) => {
    dispatch({ type: 'select_move', index: idx });
  };

  // TODO: just pass selectedMove down instead of the board and move separately?
  const {
    board: selectedBoard,
    fromPos,
    toPos,
  } = selectors.selectedMove;
  const lastMoveOnSelectedBoard = {
    fromSlot: fromPos === undefined ? undefined : getSlot(...fromPos),
    toSlot: toPos === undefined ? undefined : getSlot(...toPos),
  };

  return (
    <Dimmer.Dimmable
      as={Segment}
      basic
      blurring
      dimmed={selectors.active}
      className="Game"
      css={css`
          align-items: center;
          display: flex;
          flex-direction: column;
          height: 100%;
        `}
    >
      <Dimmer
        active={selectors.active}
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
          <Player
            {...selectors.otherPlayer}
          />
        </div>
        <Board
          board={selectedBoard}
          nextMoveColor={selectors.nextMoveColor}
          handleLegalMove={handleLegalMove}
          lastMove={lastMoveOnSelectedBoard}
          legalMoves={selectors.legalMoves}
          reversed={selectors.initialUserOrientation}
        />
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex-direction: row;
          `}
        >
          <Player
            {...selectors.currentPlayer}
          />
          <GameInfo
            activePlayer={selectors.nextMovePlayer}
            hasLegalMoves={selectors.hasLegalMoves}
            userColor={selectors.userColor}
          />
        </div>
        <ConfirmMenu
          yesHandler={handleConfirmedMove}
          noHandler={cancelMove}
          show={selectors.lastMove.pending}
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
