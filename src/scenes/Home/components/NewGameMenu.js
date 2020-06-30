import React from 'react';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { Team } from 'services/logic/constants';

import client from 'services/client';

import styled from '@emotion/styled';

const Wrapper = styled.div`
  padding: 5px;
`;

const NewGameMenu = () => {
  const username = useSelector(state => state.username);

  const createGameRequest = team => async () => {
    client.post('game/requests', {
      player1: username,
      parameters: { team },
    });
  };

  return (
    <Wrapper className="NewGameMenu">
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
    </Wrapper>
  );
};

export default NewGameMenu;
