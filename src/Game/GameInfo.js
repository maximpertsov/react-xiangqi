import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  height: 20%;
`;

const GameInfo = ({
  activePlayer, redPlayer, blackPlayer, userColor, players,
}) => {
  const userIsActive = () => {
    const { color } = activePlayer();
    return color === userColor;
  };

  const turnMessage = () => (
    userIsActive() ? 'Your turn' : 'Waiting for opponent'
  );

  const versusMessage = () => (
    `${redPlayer.name} [red] vs ${blackPlayer.name} [black]`
  );

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

const playerPropType = PropTypes.shape({
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

GameInfo.propTypes = {
  activePlayer: PropTypes.func.isRequired,
  blackPlayer: playerPropType.isRequired,
  redPlayer: playerPropType.isRequired,
  userColor: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(playerPropType).isRequired,
};

export default GameInfo;
