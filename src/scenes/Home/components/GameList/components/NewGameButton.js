import React from 'react';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';

import client from 'services/client';

import styled from '@emotion/styled';

const Wrapper = styled.div`
  padding: 5px;
`;

const NewGameButton = () => {
  const dispatch = useDispatch();

  const username = useSelector(state => state.username);

  const createGame = async () => {
    const {
      data: { slug },
    } = await client.post('game', { player1: username });
    dispatch(actions.game.slug.set(slug));
    dispatch(actions.home.showGame.set(true));
  };

  return (
    <Wrapper>
      <Button.Group fluid>
        <Popup
          content="Play with red pieces"
          trigger={
            <Button icon onClick={createGame} className="NewGame">
              <Icon color="red" fitted name="plus square outline" />
            </Button>
          }
        />
        <Popup
          content="Play with black pieces"
          trigger={
            <Button icon onClick={createGame} className="NewGame">
              <Icon color="black" fitted name="plus square outline" />
            </Button>
          }
        />
        <Popup
          content="Play with random pieces"
          trigger={
            <Button icon onClick={createGame} className="NewGame">
              <Icon fitted name="question" />
            </Button>
          }
        />
      </Button.Group>
    </Wrapper>
  );
};

export default NewGameButton;
