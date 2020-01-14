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

import { addMove, selectMove } from './actions';
import * as gameSelectors from './selectors';

import {
  getMoveCount,
  getLastMove,
  getSelectedMove,
  getPreviousMove,
  getNextMove,
  getNextMoveColor,
} from './reducers';

// TODO: seems like this needs to be a relative import
// because it imports from services/logic/constants
import { AutoMove } from '../../constants';

const Game = ({ autoMove, gameSlug, username }) => {
  const dispatch = useDispatch();
  const selectors = useSelector(({ game }) => ({
    // base state fields
    loading: game.loading,
    moves: game.moves,
    // moves
    moveCount: getMoveCount(game),
    lastMove: getLastMove(game),
    selectedMove: getSelectedMove(game),
    nextMoveColor: getNextMoveColor(game),
    previousMove: getPreviousMove(game),
    nextMove: getNextMove(game),
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

  useEffect(
    () => {
      client.fetchGame({ dispatch, gameSlug });
    },
    [dispatch, gameSlug],
  );

  useEffect(
    () => {
      const interval = client.setPollMovesInterval({
        dispatch,
        gameSlug,
        loading: selectors.loading,
        moveCount: selectors.moveCount,
        nextMovePlayer: selectors.nextMovePlayer,
        username,
      });
      return () => clearInterval(interval);
    },
    [dispatch, gameSlug, selectors, username],
  );

  useEffect(
    () => {
      if (autoMove === AutoMove.BOTH || autoMove === selectors.nextMoveColor) {
        const { board } = selectors.lastMove;
        const [fromSlot, toSlot] = board.randomMove(selectors.nextMoveColor);
        dispatch(addMove({ board, fromSlot, toSlot, pending: false }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoMove, dispatch, selectors.moves],
  );

  useEventListener(
    'keydown',
    ({ key }) => {
      switch (key) {
      case 'ArrowLeft':
        dispatch(selectMove({ moveId: selectors.previousMove.id }));
        break;
      case 'ArrowRight':
        dispatch(selectMove({ moveId: selectors.nextMove.id }));
        break;
      default:
        break;
      }
    },
  );

  // Move updates

  const handleLegalMove = useCallback(
    ({ board, fromSlot, toSlot }) => {
      dispatch(addMove({ board, fromSlot, toSlot, pending: true }));
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
        <MoveHistory />
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
