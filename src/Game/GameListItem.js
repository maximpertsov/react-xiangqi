import React from 'react';
import PropTypes from 'prop-types';

const GameListItem = ({ slug }) => <div className="GameListItem">{slug}</div>;

GameListItem.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default GameListItem;
