import React from 'react';
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
const getGameOverMessage = ({
  blackPlayer,
  blackScore,
  redPlayer,
  redScore,
}) => {
  if (redScore === 1) return `${redPlayer.name} wins!`;
  if (blackScore === 1) return `${blackPlayer.name} wins!`;
  if (redScore === 0.5 && blackScore === 0.5) return 'Draw!';
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
  state => state.blackPlayer,
  state => state.blackScore,
  state => state.redPlayer,
  state => state.redScore,
  state => state.username,
  state => getCurrentPlayer(state),
  state => getNextMovePlayer(state),

  (
    blackPlayer,
    blackScore,
    redPlayer,
    redScore,
    username,
    currentPlayer,
    nextMovePlayer,
  ) => ({
    gameOverMessage: getGameOverMessage({
      blackPlayer,
      blackScore,
      redPlayer,
      redScore,
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
  return (
    <Wrapper className="GameInfo">
      <p>{gameOverMessage || gameInProgressMessage}</p>
    </Wrapper>
  );
};

export default GameInfo;
