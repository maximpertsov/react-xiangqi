import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import BoardView from 'components/Board/components/BoardView';
import actions from 'actions';

const mapStateToProps = createSelector(
  state => state.username,
  (_, props) => get(props, 'game.player2.name'),

  (username, player2Name) => ({
    teamBlackPOV: username && username === player2Name,
  }),
);

const GameLink = ({ game }) => {
  const dispatch = useDispatch();

  const { teamBlackPOV } = useSelector(
    state => mapStateToProps(state, { game }),
    isEqual,
  );

  const setThisGameSlug = () => {
    dispatch(actions.game.slug.set(game.slug));
    dispatch(actions.home.showGame.set(true));
  };

  return (
    <Button onClick={setThisGameSlug} className="GameLink">
      <BoardView
        teamBlackPOV={teamBlackPOV}
        move={game.currentMove}
        size="tiny"
      />
    </Button>
  );
};

GameLink.propTypes = {
  game: PropTypes.shape().isRequired,
};

export default GameLink;
