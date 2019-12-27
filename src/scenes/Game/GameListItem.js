import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const GameListItem = ({ slug, setGameSlug }) => {
  const setThisGameSlug = useCallback(
    () => setGameSlug(slug),
    [slug, setGameSlug],
  );

  return (
    <Button
      onClick={setThisGameSlug}
      className="GameListItem"
    >
      {slug}
    </Button>
  );
};

GameListItem.propTypes = {
  slug: PropTypes.string.isRequired,
  setGameSlug: PropTypes.func.isRequired,
};

export default GameListItem;
