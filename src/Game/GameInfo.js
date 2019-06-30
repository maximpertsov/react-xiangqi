import React from 'react';
import PropTypes from 'prop-types';

const GameInfo = ({
  activePlayer, redPlayer, blackPlayer, userColor,
}) => {
  const { color } = activePlayer();
  const userIsActive = color === userColor;
  const turnMessage = {
    true: 'Your turn',
    false: 'Waiting for opponent',
  };
  return (
    <div>
      <p>
        { `${redPlayer.name} [red] vs ${blackPlayer.name} [black]` }
      </p>
      <p>
        {turnMessage[userIsActive]}
      </p>
    </div>
  );
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
};

export default GameInfo;
