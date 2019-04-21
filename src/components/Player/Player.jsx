import React from 'react';
import PropTypes from 'prop-types';

const Player = ({ color }) => (
  <div className="Player" color={color} />
);

Player.propTypes = {
  color: PropTypes.string.isRequired,
};

export default Player;
