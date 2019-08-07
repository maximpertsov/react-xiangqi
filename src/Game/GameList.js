import React from 'react';
import PropTypes from 'prop-types';
import GameListItem from './GameListItem';

const GameList = ({ games, setGameSlug }) => {
  const gameList = games.map((game) => (
    <GameListItem key={game.slug} slug={game.slug} setGameSlug={setGameSlug} />
  ),
  );

  return <div className="GameList">{gameList}</div>;
};

GameList.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({ slug: PropTypes.string }),
  ).isRequired,
  setGameSlug: PropTypes.func.isRequired,
};

export default GameList;
