import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getNextMovePlayer, getUserColor } from 'reducers';


const Wrapper = styled.div`
color: #999;
`;

const GameInfo = ({ hasLegalMoves }) => {
  const nextMovePlayer = useSelector(state => getNextMovePlayer(state));
  const userColor = useSelector(state => getUserColor(state));

  const userIsActive = () => {
    const { color } = nextMovePlayer;
    return color === userColor;
  };

  const loadingUser = () => userColor === undefined;

  const getMessage = () => {
    if (loadingUser()) {
      const { color } = nextMovePlayer;
      return `${color}'s turn`;
    }
    if (!hasLegalMoves) {
      // TODO: specify if won by stalemate or checkmate
      return userIsActive() ? 'You lose!' : 'You win!';
    }
    return userIsActive() ? 'Your turn' : 'Waiting for opponent';
  };

  return (
    <Wrapper className="GameInfo">
      <p>{ getMessage() }</p>
    </Wrapper>
  );
};

GameInfo.propTypes = {
  hasLegalMoves: PropTypes.bool.isRequired,
};

export default GameInfo;
