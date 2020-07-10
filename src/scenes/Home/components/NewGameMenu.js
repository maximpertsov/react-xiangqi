import React from 'react';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import { Team } from 'services/logic/constants';
import client from 'services/client';

import find from 'lodash/find';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  padding: 5px;
`;

const mapStateToProps = createSelector(
  state => state.username,
  state => state.lobbyGames,

  (username, lobbyGames) => ({
    username,
    ownLobbyRequest: find(lobbyGames, { player1: username }),
  }),
);

const NewGameMenu = () => {
  const { username, ownLobbyRequest } = useSelector(mapStateToProps, isEqual);

  const createGameRequest = team => async () => {
    client.post('game/request', {
      player1: username,
      parameters: { team },
    });
  };

  const cancelGameRequest = id => async () => {
    client.delete(`game/request/${id}`);
  };

  const renderRequestButtons = () => (
    <Button.Group fluid>
      <Popup
        content="Play with red pieces"
        trigger={
          <Button icon onClick={createGameRequest(Team.RED)}>
            <Icon color="red" fitted name="plus square outline" />
          </Button>
        }
      />
      <Popup
        content="Play with black pieces"
        trigger={
          <Button icon onClick={createGameRequest(Team.BLACK)}>
            <Icon color="black" fitted name="plus square outline" />
          </Button>
        }
      />
      <Popup
        content="Play with random pieces"
        trigger={
          <Button icon onClick={createGameRequest()}>
            <Icon fitted name="question" />
          </Button>
        }
      />
    </Button.Group>
  );

  const renderCancelButton = () => (
    <Button onClick={cancelGameRequest(ownLobbyRequest.id)} fluid loading />
  );

  return (
    <Wrapper className="NewGameMenu">
      {ownLobbyRequest ? renderCancelButton() : renderRequestButtons()}
    </Wrapper>
  );
};

export default NewGameMenu;
