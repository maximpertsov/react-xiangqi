import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from '@emotion/styled';
import { Button, Header, Icon, Popup } from 'semantic-ui-react';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';

import client from 'services/client';
import { Team } from 'services/logic/constants';
import { WebSocketContext } from 'services/websockets';

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
  grid-template-columns: repeat(${props => props.repeat}, 1fr);
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
        io.send('updated_lobby_games');
      });
  };

  const cancelGameRequest = id => () => {
    client.delete(`game/request/${id}`).then(() => {
      io.send('updated_lobby_games');
    });
  };

  const renderRequestButtons = () => (
    <GridWrapper repeat={3}>
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
    </GridWrapper>
  );

  const renderCancelButton = () => (
    <GridWrapper repeat={1}>
      <Button onClick={cancelGameRequest(ownLobbyRequest.id)} icon loading>
        <Icon />
      </Button>
    </GridWrapper>
  );

  return (
    <Wrapper className="NewGameMenu">
      <Header size="medium">Create game</Header>
      {ownLobbyRequest ? renderCancelButton() : renderRequestButtons()}
    </Wrapper>
  );
};

export default NewGameMenu;
