import React from 'react';
import styled from '@emotion/styled';
import { Header } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import GameLink from './GameLink';

const Wrapper = styled.div`
  border: 1px #ccc solid;
  margin-top: 15px;
  margin-bottom: 15px;
  width: 100%;
  padding: 5px;
`;

const SlugsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 5px;
`;

const mapStateToProps = createSelector(
  [state => state],

  state => ({
    games: state.games,
  }),
);

const renderGameLink = game => <GameLink key={game.slug} game={game} />;

const GameList = () => {
  const { games } = useSelector(mapStateToProps, isEqual);

  return (
    <Wrapper className="GameList">
      <Header size="medium">Games in play</Header>
      <SlugsWrapper>{games.map(renderGameLink)}</SlugsWrapper>
    </Wrapper>
  );
};

export default GameList;
