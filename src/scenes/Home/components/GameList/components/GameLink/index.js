import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const GameLink = ({ slug, setGameSlug }) => {
  const setThisGameSlug = useCallback(
    () => setGameSlug(slug),
    [slug, setGameSlug],
  );

  return (
    <Button
      onClick={setThisGameSlug}
      className="GameLink"
    >
      {slug}
    </Button>
  );
};

GameLink.propTypes = {
  slug: PropTypes.string.isRequired,
  setGameSlug: PropTypes.func.isRequired,
};

export default GameLink;
