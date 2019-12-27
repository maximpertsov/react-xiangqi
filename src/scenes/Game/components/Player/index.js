/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';

import { Color } from 'services/logic/constants';

const Player = ({ name, color }) => (
  <div
    className="Player"
    css={{ color: color === Color.RED ? 'red' : 'black' }}
  >
    {`${color === Color.RED ? '帥' : '將'} ${name || ''}`}
  </div>
);

Player.propTypes = {
  color: PropTypes.string.isRequired,
  name: PropTypes.string,
};

Player.defaultProps = {
  name: undefined,
};

export default Player;
