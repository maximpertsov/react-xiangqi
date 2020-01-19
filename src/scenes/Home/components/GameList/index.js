import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import GameLink from './components/GameLink';

const Wrapper = styled.div`
  border:1px #CCC solid;
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 5px;
  width: 100%;
`;

const GameList = ({ games }) => {
  // TODO: fetch instead of passing in?
  const gameList = games.map(
    (game) => <GameLink key={game.slug} slug={game.slug} />
  );

  return (
    <Wrapper className="GameList">
      Games in play
      <div>
        {gameList}
      </div>
    </Wrapper>
  );
};

GameList.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({ slug: PropTypes.string }),
  ).isRequired,
};

export default GameList;
