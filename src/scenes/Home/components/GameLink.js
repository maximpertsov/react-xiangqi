import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { Button, Header } from 'semantic-ui-react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import actions from 'actions';
import BoardView from 'components/Board/components/BoardView';
import PropTypes from 'prop-types';
import { getOpponent } from 'reducers/selectors';

const mapStateToProps = createSelector(
  state => state.username,
  (_, props) => props.game,

  (username, game) => ({
    opponent: getOpponent({ username, ...game }),
    teamBlackPOV: username && username === get(game, 'player2.name'),
  }),
);

const GameLink = ({ game }) => {
  const dispatch = useDispatch();

  const { opponent, teamBlackPOV } = useSelector(
    state => mapStateToProps(state, { game }),
    isEqual,
  );

  const setThisGameSlug = () => {
    dispatch(actions.game.slug.set(game.slug));
    dispatch(actions.home.showGame.set(true));
  };

  return (
    <Button onClick={setThisGameSlug} className="GameLink">
      <Header size="tiny">vs {opponent.name}</Header>
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
