import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import actions from 'actions';

import BoardView from 'components/Board/components/BoardView';

const GameLink = ({ game }) => {
  const dispatch = useDispatch();

  const setThisGameSlug = () => {
    dispatch(actions.game.slug.set(game.slug));
    dispatch(actions.home.showGame.set(true));
  };

  // TODO: pass this to the board view when possible
  // TODO: also, you might need to pass all of the move data
  console.log(game.currentMove.fen);

  return (
    <Button onClick={setThisGameSlug} className="GameLink">
      <BoardView size="tiny" />
    </Button>
  );
};

GameLink.propTypes = {
  game: PropTypes.shape().isRequired,
};

export default GameLink;
