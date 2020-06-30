import React from 'react';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { Team } from 'services/logic/constants';

import client from 'services/client';

import some from 'lodash/some';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  padding: 5px;
`;

const NewGameMenu = () => {
  const username = useSelector(state => state.username);
  const hasOwnLobbyRequests = useSelector(state =>
    some(state.lobbyRequests, { player1: username }),
  );

  const createGameRequest = team => async () => {
    client.post('game/requests', {
      player1: username,
      parameters: { team },
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

  const renderCancelButton = () => <Button fluid loading />;

  return (
    <Wrapper className="NewGameMenu">
      {hasOwnLobbyRequests ? renderCancelButton() : renderRequestButtons()}
    </Wrapper>
  );
};

export default NewGameMenu;
