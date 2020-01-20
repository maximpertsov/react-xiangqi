/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import useEventListener from '@use-it/event-listener';

import { makeMove, selectMove } from 'actions';
import {
  getMoveCount,
  getLastMove,
  getSelectedMove,
  getPreviousMove,
  getNextMove,
  getNextMoveColor,
  getOtherPlayer,
  getInitialUserOrientation,
  getCurrentPlayer,
} from 'reducers';

import Board from 'components/Board';

import ConfirmMoveMenu from './components/ConfirmMoveMenu';
import GameInfo from './components/GameInfo';
import GameClient from './components/GameClient';
import MoveHistory from './components/MoveHistory';
import Player from './components/Player';

import * as gameSelectors from './selectors';

const Game = () => {
  const dispatch = useDispatch();
  const autoMove = useSelector(state => state.autoMove);
  const gameSlug = useSelector(state => state.gameSlug);

  const selectors = useSelector(
    state => ({
      // base state fields
      loading: state.loading,
      // moves
      moveCount: getMoveCount(state),
      lastMove: getLastMove(state),
      selectedMove: getSelectedMove(state),
      nextMoveColor: getNextMoveColor(state),
      previousMove: getPreviousMove(state),
      nextMove: getNextMove(state),
      // players
      otherPlayer: getOtherPlayer(state),
      initialUserOrientation: getInitialUserOrientation(state),
      currentPlayer: getCurrentPlayer(state),
      // game logic
      legalMoves: gameSelectors.getLegalMoves(state),
      hasLegalMoves: gameSelectors.hasLegalMoves(state),
      // other
    }),
    shallowEqual,
  );
  // TODO: this is a massive hack -- should not rely on move count to determine
  // if this is the initial load
  const active = useSelector(
    state => gameSlug !== null && state.loading && selectors.moveCount <= 1,
  );

  useEffect(
    () => {
      setTimeout(() => {
        if (autoMove.includes(selectors.nextMoveColor)) {
          const { board } = selectors.lastMove;
          const [fromSlot, toSlot] = board.randomMove(selectors.nextMoveColor);
          dispatch(makeMove({ fromSlot, toSlot, pending: false }));
        }}, 1000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoMove, dispatch, selectors.nextMoveColor],
  );

  useEventListener('keydown', ({ key }) => {
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
  });

  return (
    <GameClient>
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
        <Dimmer active={active} page>
          <Loader>Loading</Loader>
        </Dimmer>
        <div
          css={css`
            display: flex;
            justify-content: space-around;
            flex-direction: column;
          `}
        >
          <Player {...selectors.otherPlayer} />
          <Board
            nextMoveColor={selectors.nextMoveColor}
            legalMoves={selectors.legalMoves}
            reversed={selectors.initialUserOrientation}
          />
          <Player {...selectors.currentPlayer} />
          <GameInfo hasLegalMoves={selectors.hasLegalMoves} />
          <ConfirmMoveMenu />
          <MoveHistory />
        </div>
      </Dimmer.Dimmable>
    </GameClient>
  );
};

export default Game;
