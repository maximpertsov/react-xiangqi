/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { useState, useEffect } from 'react';
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

const Game = ({ gameSlug }) => {
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
    console.log(`Username: ${username}`);
    const { name: nextMovePlayerName } = getNextMovePlayer(players, moves);
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
    [gameSlug, fetchGame, startPolling],
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

  function handleUsernameUpdate(name) {
    console.log(`received username update: ${name}`);
    setUsername(name);
    startPolling();
  }

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
        <LoginForm handleUsernameUpdate={handleUsernameUpdate} />
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
