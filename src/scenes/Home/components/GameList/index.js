import React from 'react';
import styled from '@emotion/styled';
import { Header } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

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

const mapStateToProps = createSelector(
  state => state,

  state => ({
    gameSlugs: state.games.map(({ slug }) => slug),
  }),
);

const renderGameLink = slug => <GameLink key={slug} slug={slug} />;

const GameList = () => {
  const { gameSlugs } = useSelector(mapStateToProps, isEqual);

  return (
    <Wrapper className="GameList">
      <Header size="medium">Games in play</Header>
      <GridWrapper>{gameSlugs.map(renderGameLink)}</GridWrapper>
    </Wrapper>
  );
};

export default GameList;
