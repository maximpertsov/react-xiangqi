/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

import GameLink from './components/GameLink';

const GameList = ({ games }) => {
  const gameList = games.map(
    (game) => <GameLink key={game.slug} slug={game.slug} />
  );

  return (
    <div
      className="GameList"
      css={css`
        border:1px #CCC solid;
        margin-top: 15px;
        margin-bottom: 15px;
        padding: 5px;
        width: 100%;
      `}
    >
      Games in play
      <div>
        {gameList}
      </div>
    </div>
  );
};

GameList.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({ slug: PropTypes.string }),
  ).isRequired,
};

export default GameList;
