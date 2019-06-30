import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { playerPropType } from '../customPropTypes';

const Wrapper = styled.div`
  height: 20%;
`;

const GameInfo = ({ activePlayer, userColor, players }) => {
  const userIsActive = () => {
    const { color } = activePlayer;
    return color === userColor;
  };

  const turnMessage = () => (
    userIsActive() ? 'Your turn' : 'Waiting for opponent'
  );

  const getRedPlayer = () => players.find((p) => p.color === 'red');

  const getBlackPlayer = () => players.find((p) => p.color === 'black');

  const versusMessage = () => {
    const { color: redColor, name: redName } = getRedPlayer();
    const { color: blackColor, name: blackName } = getBlackPlayer();
    return `${redName} [${redColor}] vs ${blackName} [${blackColor}]`;
  };

  const isLoading = () => players.length === 0;

  const renderLoading = () => (<div><p>Loading...</p></div>);

  const renderLoaded = () => (
    <Wrapper>
      <p>{ versusMessage() }</p>
      <p>{ turnMessage() }</p>
    </Wrapper>
  );

  return isLoading() ? renderLoading() : renderLoaded();
};

GameInfo.propTypes = {
  activePlayer: playerPropType,
  players: PropTypes.arrayOf(playerPropType).isRequired,
  userColor: PropTypes.string,
};

GameInfo.defaultProps = {
  activePlayer: null,
  userColor: null,
};

export default GameInfo;
