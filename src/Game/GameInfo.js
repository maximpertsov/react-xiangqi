import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { playerPropType } from '../customPropTypes';
import Player from './Player/Player';

const Wrapper = styled.div`
  height: 20%;
  margin-top: 15px;
  padding: 20px;
  outline: thin solid #999;
`;

const GameInfo = ({
  activePlayer, activeLegalMoves, userColor, players,
}) => {
  const countLegalMovesByActivePlayer = () => (
    activeLegalMoves.reduce((count, toSlots) => count + toSlots.length, 0)
  );

  const userIsActive = () => {
    const { color } = activePlayer;
    return color === userColor;
  };

  const loadingUser = () => userColor === undefined;

  const getMessage = () => {
    if (loadingUser()) {
      const { color } = activePlayer;
      return `${color}'s turn`;
    }

    if (countLegalMovesByActivePlayer() === 0) {
      // TODO: specify if won by stalemate or checkmate
      return userIsActive() ? 'You lose!' : 'You win!';
    }
    return userIsActive() ? 'Your turn' : 'Waiting for opponent';
  };

  const getRedPlayer = () => players.find((p) => p.color === 'red');

  const getBlackPlayer = () => players.find((p) => p.color === 'black');

  return (
    <Wrapper>
      <Player {...getRedPlayer()} />
      <Player {...getBlackPlayer()} />
      <p>{ getMessage() }</p>
    </Wrapper>
  );
};

GameInfo.propTypes = {
  activePlayer: playerPropType,
  activeLegalMoves: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.number),
  ).isRequired,
  players: PropTypes.arrayOf(playerPropType).isRequired,
  userColor: PropTypes.string,
};

GameInfo.defaultProps = {
  activePlayer: undefined,
  userColor: undefined,
};

export default GameInfo;
