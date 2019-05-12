import React from 'react';
import PropTypes from 'prop-types';

const GameInfo = ({ activePlayer, redPlayer, blackPlayer }) => {
  const { color } = activePlayer();
  return (
    <div>
      <p>
        { `${redPlayer.name} [red] vs ${blackPlayer.name} [black]` }
      </p>
      <p>
        { `${color}'s turn` }
      </p>
    </div>
  );
};

const playerShape = PropTypes.shape({
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

GameInfo.propTypes = {
  activePlayer: PropTypes.func.isRequired,
  blackPlayer: playerShape.isRequired,
  redPlayer: playerShape.isRequired,
};

export default GameInfo;
