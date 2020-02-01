import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { setGameSlug, toggleShowGame } from 'actions';

const GameLink = ({ slug }) => {
  const dispatch = useDispatch();

  const setThisGameSlug = useCallback(() => {
    dispatch(setGameSlug({ gameSlug: slug }));
    dispatch(toggleShowGame({ showGame: true }));
  }, [dispatch, slug]);

  return (
    <Button onClick={setThisGameSlug} className="GameLink">
      {slug}
    </Button>
  );
};

GameLink.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default GameLink;
