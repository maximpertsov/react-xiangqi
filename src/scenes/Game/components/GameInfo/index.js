import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { getLastMove, getNextMovePlayer, getUserColor } from 'reducers';

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
  const lastMove = useSelector(state => getLastMove(state));
  const nextMovePlayer = useSelector(state => getNextMovePlayer(state));
  const userColor = useSelector(state => getUserColor(state));

  const userIsActive = () => {
    const { color } = nextMovePlayer;
    return color === userColor;
  };

  const loadingUser = () => userColor === undefined;

  // eslint-disable-next-line complexity
  const getMessage = () => {
    if (loadingUser()) {
      const { color } = nextMovePlayer;
      return `${color}'s turn`;
    }
    // TODO: get this from the server
    if (lastMove.legalMoves && lastMove.legalMoves.length === 0) {
      // TODO: specify if won by stalemate or checkmate
      return userIsActive() ? 'You lose!' : 'You win!';
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
