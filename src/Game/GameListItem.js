import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const GameListItem = ({ slug, setGameSlug }) => {
  const setThisGameSlug = useCallback(
    () => setGameSlug(slug),
    [slug, setGameSlug],
  );

  return (
    <div
      role="button"
      onClick={setThisGameSlug}
      className="GameListItem"
    >
      {slug}
    </div>
  );
};

GameListItem.propTypes = {
  slug: PropTypes.string.isRequired,
  setGameSlug: PropTypes.func.isRequired,
};

export default GameListItem;
