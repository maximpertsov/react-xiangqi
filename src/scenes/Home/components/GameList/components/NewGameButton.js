import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
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
      <Button icon fluid onClick={createGame} className="NewGame">
        <Icon fitted name="plus square outline" />
      </Button>
    </Wrapper>
  );
};

export default NewGameButton;
