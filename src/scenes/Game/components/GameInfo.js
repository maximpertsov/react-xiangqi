import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { getLastMove, getNextMovePlayer, getUserColor } from 'reducers';
import isEqual from 'lodash/isEqual';

// TODO: since this style also appears in the Player component,
// TODO: consider moving to commonStyles or shared scss?
const Wrapper = styled.div`
  align-items: center;
  color: #999;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const GameInfo = () => {
  const lastMove = useSelector(state => getLastMove(state), isEqual);
  const nextMovePlayer = useSelector(
    state => getNextMovePlayer(state),
    isEqual,
  );
  const userColor = useSelector(state => getUserColor(state));

  const userIsActive = () => {
    const { color } = nextMovePlayer;
    return color === userColor;
  };

  // TODO: move this logic into a selector
  // eslint-disable-next-line complexity
  const getMessage = () => {
    const { color } = nextMovePlayer;

    if (lastMove.gameResult) {
      const {
        gameResult: [redScore, blackScore],
      } = lastMove;
      if (redScore === 1) {
        if (color === 'red') return 'You lose!';
        if (color === 'black') return 'You win!';
      }
      if (blackScore === 1) {
        if (color === 'red') return 'You win!';
        if (color === 'black') return 'You lose!';
      }
      if (redScore === 0.5 && blackScore === 0.5) {
        return 'Draw!';
      }
    }

    return userIsActive() ? 'Your turn' : 'Waiting for opponent';
  };

  return (
    <Wrapper className="GameInfo">
      <p>{getMessage()}</p>
    </Wrapper>
  );
};

export default GameInfo;
