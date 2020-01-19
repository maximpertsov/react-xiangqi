import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import GameLink from './components/GameLink';

const Wrapper = styled.div`
  border:1px #CCC solid;
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 5px;
  width: 100%;
`;

const GameList = () => {
  // TODO: define custom selector
  const gameSlugs = useSelector((state) => state.games.map(({ slug }) => slug));

  return (
    <Wrapper className="GameList">
      Games in play
      <div>
        {gameSlugs.map((slug) => <GameLink key={slug} slug={slug} />)}
      </div>
    </Wrapper>
  );
};

export default GameList;
