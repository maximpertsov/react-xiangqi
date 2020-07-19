import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from '@emotion/styled';
import { Header } from 'semantic-ui-react';
import flatMap from 'lodash/flatMap';
import isEqual from 'lodash/isEqual';
import last from 'lodash/last';

import actions from 'actions';
import client from 'services/client';

import LobbyGame from './LobbyGame';

const Wrapper = styled.div`
  border: 1px #ccc solid;
  margin-top: 15px;
  margin-bottom: 15px;
  width: 100%;
  padding: 5px;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-row-gap: 5px;
  grid-template-columns: repeat(3, 1fr);
`;

const mapStateToProps = createSelector(
  [state => state],

  state => ({
    lobbyGames: state.lobbyGames,
    messages: state.messages,
    username: state.username,
  }),
);

const Lobby = () => {
  const dispatch = useDispatch();

  const { lobbyGames, messages, username } = useSelector(
    mapStateToProps,
    isEqual,
  );

  useEffect(() => {
    const lastMessage = last(messages);

    if (lastMessage && lastMessage.type !== 'updated_lobby_games') {
      return;
    }

    client
      .get('game/request')
      .then(response => dispatch(actions.home.lobbyGames.set(response.data)));
  }, [dispatch, messages, username]);

  return (
    <Wrapper className="Lobby">
      <Header size="medium">Lobby</Header>
      <GridWrapper>
        {flatMap(lobbyGames, (request, index) => {
          if (request.player1 === username) return [];

          return [
            <LobbyGame
              key={index}
              id={request.id}
              parameters={request.parameters}
            />,
          ];
        })}
      </GridWrapper>
    </Wrapper>
  );
};

export default Lobby;
