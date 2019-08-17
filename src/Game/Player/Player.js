/** @jsx jsx */
import { jsx } from '@emotion/core';

import PropTypes from 'prop-types';

const Player = ({ name, color }) => (
  <div
    className="Player"
    css={{
      color,
    }}
  >
    {`${color === 'red' ? '帥' : '將'} ${name || ''}`}
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
