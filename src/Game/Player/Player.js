import React from 'react';
import PropTypes from 'prop-types';

const Player = ({ name, color }) => (
  <div className="Player" name={name} color={color} />
);

Player.propTypes = {
  color: PropTypes.string.isRequired,
  name: PropTypes.string,
};


Player.defaultProps = {
  name: 'anonymous',
};


export default Player;
