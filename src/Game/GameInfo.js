import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { playerPropType } from '../customPropTypes';
// TODO: move to custom props?
import { boardPropType } from '../logic';
import Player from './Player/Player';

const Wrapper = styled.div`
  height: 20%;
  margin-top: 15px;
  padding: 20px;
  outline: thin solid #999;
`;

const GameInfo = ({
  activePlayer, latestBoard, userColor, players,
}) => {
  const countLegalMovesByActivePlayer = () => {
    const { color } = activePlayer;
    return latestBoard
      .legalMovesByColor(color)
      .reduce((count, toSlots) => count + toSlots.length, 0);
  };

  const userIsActive = () => {
    const { color } = activePlayer;
    return color === userColor;
  };

  const turnMessage = () => {
    if (countLegalMovesByActivePlayer() === 0) {
      // TODO: specify if won by stalemate or checkmate
      return userIsActive() ? 'You lose!' : 'You win!';
    }
    return userIsActive() ? 'Your turn' : 'Waiting for opponent';
  };

  const getRedPlayer = () => players.find((p) => p.color === 'red');

  const getBlackPlayer = () => players.find((p) => p.color === 'black');

  const isLoading = () => players.length === 0;

  const renderLoading = () => (<div><p>Loading...</p></div>);

  const renderLoaded = () => (
    <Wrapper>
      <Player {...getRedPlayer()} />
      <Player {...getBlackPlayer()} />
      <p>{ turnMessage() }</p>
    </Wrapper>
  );

  return isLoading() ? renderLoading() : renderLoaded();
};

GameInfo.propTypes = {
  activePlayer: playerPropType,
  players: PropTypes.arrayOf(playerPropType).isRequired,
  userColor: PropTypes.string,
  latestBoard: boardPropType.isRequired,
};

GameInfo.defaultProps = {
  activePlayer: null,
  userColor: null,
};

export default GameInfo;
