import React, { useContext } from 'react';
import { Button, Header, Icon, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import { Team } from 'services/logic/constants';
import client from 'services/client';
import { WebSocketContext } from 'services/WebSocketProvider';

import find from 'lodash/find';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  padding: 5px;
`;

const mapStateToProps = createSelector(
  [state => state],

  state => ({
    username: state.username,
    ownLobbyRequest: find(state.lobbyGames, { player1: state.username }),
  }),
);

const NewGameMenu = () => {
  const io = useContext(WebSocketContext);

  const { username, ownLobbyRequest } = useSelector(mapStateToProps, isEqual);

  const createGameRequest = team => () => {
    client
      .post('game/request', {
        player1: username,
        parameters: { team },
      })
      .then(() => {
        io.send({ type: 'updated_lobby_games' });
      });
  };

  const cancelGameRequest = id => () => {
    client.delete(`game/request/${id}`).then(() => {
      io.send({ type: 'updated_lobby_games' });
    });
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
      <Header size="medium">Create game</Header>
      {ownLobbyRequest ? renderCancelButton() : renderRequestButtons()}
    </Wrapper>
  );
};

export default NewGameMenu;
