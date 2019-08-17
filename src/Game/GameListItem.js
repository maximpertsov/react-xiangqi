import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { MenuButton } from '../commonStyles';

const GameListItem = ({ slug, setGameSlug }) => {
  const setThisGameSlug = useCallback(
    () => setGameSlug(slug),
    [slug, setGameSlug],
  );

  return (
    <MenuButton
      onClick={setThisGameSlug}
      className="GameListItem"
    >
      {slug}
    </MenuButton>
  );
};

GameListItem.propTypes = {
  slug: PropTypes.string.isRequired,
  setGameSlug: PropTypes.func.isRequired,
};

export default GameListItem;
