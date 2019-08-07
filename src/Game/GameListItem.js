import React from 'react';
import PropTypes from 'prop-types';

const GameListItem = ({ slug }) => {
  const href = `${window.location.origin}/?game=${slug}`;

  return <a href={href} className="GameListItem">{slug}</a>;
};

GameListItem.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default GameListItem;
