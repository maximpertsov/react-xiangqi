/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import PropTypes from "prop-types";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import { useCallback, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useEventListener from "@use-it/event-listener";

import { makeMove, selectMove } from "actions";
import {
  getMoveCount,
  getLastMove,
  getSelectedMove,
  getPreviousMove,
  getNextMove,
  getNextMoveColor,
} from "reducers";

import Board from "components/Board";
import { getSlot } from "services/logic/utils";

import ConfirmMenu from "./components/ConfirmMenu";
import GameInfo from "./components/GameInfo";
import GameClient from "./components/GameClient";
import MoveHistory from "./components/MoveHistory";
import Player from "./components/Player";
import * as client from "./services/client";

import * as gameSelectors from "./selectors";

// TODO: seems like this needs to be a relative import
// because it imports from services/logic/constants
import { AutoMove } from "../../constants";

const Game = ({ autoMove }) => {
  const dispatch = useDispatch();
  const gameSlug = useSelector(state => state.gameSlug);
  const username = useSelector(state => state.username);

  const selectors = useSelector(
    state => ({
      // base state fields
      loading: state.loading,
      moves: state.moves,
      // moves
      moveCount: getMoveCount(state),
      lastMove: getLastMove(state),
      selectedMove: getSelectedMove(state),
      nextMoveColor: getNextMoveColor(state),
      previousMove: getPreviousMove(state),
      nextMove: getNextMove(state),
      // players
      nextMovePlayer: gameSelectors.getNextMovePlayer(state),
      userColor: gameSelectors.getUserColor(state),
      otherPlayer: gameSelectors.getOtherPlayer(state),
      initialUserOrientation: gameSelectors.getInitialUserOrientation(state),
      currentPlayer: gameSelectors.getCurrentPlayer(state),
      // game logic
      legalMoves: gameSelectors.getLegalMoves(state),
      hasLegalMoves: gameSelectors.hasLegalMoves(state),
      // other
      active: gameSlug !== null && state.loading,
    }),
    shallowEqual,
  );

  useEffect(
    () => {
      if (autoMove === AutoMove.BOTH || autoMove === selectors.nextMoveColor) {
        const { board } = selectors.lastMove;
        const [fromSlot, toSlot] = board.randomMove(selectors.nextMoveColor);
        dispatch(makeMove({ fromSlot, toSlot, pending: false }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoMove, dispatch, selectors.moves],
  );

  useEventListener("keydown", ({ key }) => {
    switch (key) {
      case "ArrowLeft":
        dispatch(selectMove({ moveId: selectors.previousMove.id }));
        break;
      case "ArrowRight":
        dispatch(selectMove({ moveId: selectors.nextMove.id }));
        break;
      default:
        break;
    }
  });

  // Move updates

  const handleLegalMove = useCallback(
    ({ fromSlot, toSlot }) => {
      dispatch(makeMove({ fromSlot, toSlot, pending: true }));
    },
    [dispatch],
  );

  const cancelMove = useCallback(() => {
    dispatch({ type: "cancel_moves" });
  }, [dispatch]);

  const handleConfirmedMove = useCallback(async () => {
    const { fromPos, toPos, pending } = selectors.lastMove;
    if (!pending) return;

    await client.postMove({ dispatch, fromPos, toPos, gameSlug, username });
    dispatch({ type: "confirm_moves" });
  }, [dispatch, gameSlug, selectors, username]);

  // TODO: just pass selectedMove down instead of the board and move separately?
  const { board: selectedBoard, fromPos, toPos } = selectors.selectedMove;
  const lastMoveOnSelectedBoard = {
    fromSlot: fromPos === undefined ? undefined : getSlot(...fromPos),
    toSlot: toPos === undefined ? undefined : getSlot(...toPos),
  };

  return (
    <GameClient>
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
        <Dimmer active={selectors.active} page>
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
            <Player {...selectors.otherPlayer} />
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
            <Player {...selectors.currentPlayer} />
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
            disabled={gameSlug === null}
          />
          <MoveHistory />
        </div>
      </Dimmer.Dimmable>
    </GameClient>
  );
};

Game.propTypes = {
  autoMove: PropTypes.oneOf([undefined, ...Object.values(AutoMove)]),
};

Game.defaultProps = {
  autoMove: undefined,
};

export default Game;
