import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import actions from 'actions';

import BoardView from 'components/Board/components/BoardView';

const GameLink = ({ slug }) => {
  const dispatch = useDispatch();

  const setThisGameSlug = () => {
    dispatch(actions.game.slug.set(slug));
    dispatch(actions.home.showGame.set(true));
  };

  return (
    <Button onClick={setThisGameSlug} className="GameLink">
      <BoardView />
    </Button>
  );
};

GameLink.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default GameLink;
