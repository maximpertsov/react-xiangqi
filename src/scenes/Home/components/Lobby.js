import React, { useEffect } from 'react';
import client from 'services/client';
import styled from '@emotion/styled';
import { Header } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import flatMap from 'lodash/flatMap';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

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
  grid-template-columns: repeat(3, 1fr);
`;

const mapStateToProps = createSelector(
  [state => state],

  state => ({
    lobbyRequests: state.lobbyRequests,
    username: state.username,
  }),
);

const Lobby = () => {
  const dispatch = useDispatch();

  const { lobbyRequests, username } = useSelector(mapStateToProps, isEqual);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!username) return;

      client
        .get('game/request')
        .then(response =>
          dispatch(actions.home.lobbyRequests.set(response.data)),
        );
    }, 2000);

    return () => clearInterval(interval);
  }, [dispatch, username]);

  return (
    <Wrapper className="Lobby">
      <Header size="medium">Lobby</Header>
      <GridWrapper>
        {flatMap(lobbyRequests, (request, index) => {
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
