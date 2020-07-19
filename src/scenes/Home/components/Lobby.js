import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from '@emotion/styled';
import { Header } from 'semantic-ui-react';
import flatMap from 'lodash/flatMap';
import isEqual from 'lodash/isEqual';

import actions from 'actions';
import { getLastMessage } from 'reducers/selectors';
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
    lastMessage: getLastMessage(state),
    lobbyGames: state.lobbyGames,
    username: state.username,
  }),
);

const Lobby = () => {
  const dispatch = useDispatch();

  const { lastMessage, lobbyGames, username } = useSelector(
    mapStateToProps,
    isEqual,
  );

  useEffect(() => {
    if (lastMessage && lastMessage.type !== 'updated_lobby_games') {
      return;
    }

    client
      .get('game/request')
      .then(response => dispatch(actions.home.lobbyGames.set(response.data)));
  }, [dispatch, lastMessage, username]);

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
