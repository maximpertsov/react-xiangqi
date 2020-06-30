import React from 'react';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { Team } from 'services/logic/constants';

import client from 'services/client';

import styled from '@emotion/styled';

const Wrapper = styled.div`
  padding: 5px;
`;

const NewGameButton = () => {
  const username = useSelector(state => state.username);

  const createGame = team => async () => {
    client.post('game/requests', {
      player1: username,
      parameters: { team },
    });
  };

  return (
    <Wrapper>
      <Button.Group fluid>
        <Popup
          content="Play with red pieces"
          trigger={
            <Button icon onClick={createGame(Team.RED)} className="NewGame">
              <Icon color="red" fitted name="plus square outline" />
            </Button>
          }
        />
        <Popup
          content="Play with black pieces"
          trigger={
            <Button icon onClick={createGame(Team.BLACK)} className="NewGame">
              <Icon color="black" fitted name="plus square outline" />
            </Button>
          }
        />
        <Popup
          content="Play with random pieces"
          trigger={
            <Button icon onClick={createGame()} className="NewGame">
              <Icon fitted name="question" />
            </Button>
          }
        />
      </Button.Group>
    </Wrapper>
  );
};

export default NewGameButton;
