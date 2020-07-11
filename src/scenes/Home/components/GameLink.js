import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import actions from 'actions';

const GameLink = ({ slug }) => {
  const dispatch = useDispatch();

  const setThisGameSlug = () => {
    dispatch(actions.game.slug.set(slug));
    dispatch(actions.home.showGame.set(true));
  };

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
