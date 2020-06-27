import React, { useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { getNextMovePlayer, getCurrentPlayer } from 'reducers';

import isEqual from 'lodash/isEqual';

import { Team } from 'services/logic/constants';

const Wrapper = styled.div`
  align-items: center;
  color: #999;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

// eslint-disable-next-line complexity
const getGameOverMessage = ({ player2, score2, player1, score1 }) => {
  if (score1 === 1) return `${player1.name} wins!`;
  if (score2 === 1) return `${player2.name} wins!`;
  if (score1 === 0.5 && score2 === 0.5) return 'Draw!';
};

const getGameInProgressMessage = ({
  currentPlayer,
  nextMovePlayer,
  username,
}) => {
  if (!username && nextMovePlayer.team === Team.RED) {
    return 'Your turn';
  }
  if (isEqual(nextMovePlayer, currentPlayer)) {
    return 'Your turn';
  }

  return 'Waiting for opponent';
};

const mapStateToProps = createSelector(
  state => state.player2,
  state => state.score2,
  state => state.player1,
  state => state.score1,
  state => state.username,
  state => getCurrentPlayer(state),
  state => getNextMovePlayer(state),

  (
    player2,
    score2,
    player1,
    score1,
    username,
    currentPlayer,
    nextMovePlayer,
  ) => ({
    gameOverMessage: getGameOverMessage({
      player2,
      score2,
      player1,
      score1,
    }),
    gameInProgressMessage: getGameInProgressMessage({
      currentPlayer,
      nextMovePlayer,
      username,
    }),
  }),
);

const GameInfo = () => {
  const { gameOverMessage, gameInProgressMessage } = useSelector(
    mapStateToProps,
    isEqual,
  );

  const notify = useCallback(() => {
    if (window.document.hasFocus()) return;

    new window.Notification(gameOverMessage || gameInProgressMessage);
  }, [gameInProgressMessage, gameOverMessage]);

  useEffect(() => {
    window.document.title = gameOverMessage || gameInProgressMessage;

    if (!('Notification' in window)) return;

    switch (window.Notification.permission) {
      case 'denied':
        break;
      case 'granted':
        notify();
        break;
      default:
        window.Notification.requestPermission(permission => {
          if (permission !== 'granted') return;

          notify();
        });
    }
  }, [gameInProgressMessage, gameOverMessage, notify]);

  return (
    <Wrapper className="GameInfo">
      <p>{gameOverMessage || gameInProgressMessage}</p>
    </Wrapper>
  );
};

export default GameInfo;
