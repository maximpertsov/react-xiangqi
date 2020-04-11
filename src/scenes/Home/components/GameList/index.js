import React from 'react';
import styled from '@emotion/styled';
import { Header } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import GameLink from './components/GameLink';

const Wrapper = styled.div`
  border: 1px #ccc solid;
  margin-top: 15px;
  margin-bottom: 15px;
  width: 100%;
  padding: 5px;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const GameList = () => {
  // TODO: define custom selector
  const gameSlugs = useSelector(state => state.games.map(({ slug }) => slug));

  return (
    <Wrapper className="GameList">
      <Header size="medium">Games in play</Header>
      <GridWrapper>
        {gameSlugs.map(slug => (
          <GameLink key={slug} slug={slug} />
        ))}
      </GridWrapper>
    </Wrapper>
  );
};

export default GameList;
