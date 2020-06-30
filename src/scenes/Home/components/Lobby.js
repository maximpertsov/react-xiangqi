import React, { useEffect } from 'react';
import client from 'services/client';
import styled from '@emotion/styled';
import { Header, Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';

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

const GridItemWrapper = styled.div`
  padding: 5px;
`;

const Lobby = () => {
  const dispatch = useDispatch();

  const lobbyRequests = useSelector(state => state.lobbyRequests);
  const username = useSelector(state => state.username);

  useEffect(() => {
    if (!username) return;

    client
      .get('game/requests')
      .then(response =>
        dispatch(actions.home.lobbyRequests.set(response.data)),
      );
  }, [dispatch, username]);

  return (
    <Wrapper className="Lobby">
      <Header size="medium">Lobby</Header>
      <GridWrapper>
        {lobbyRequests.map((request, index) => (
          <GridItemWrapper key={index}>
            <Button fluid className="GameLink">
              {request.parameters.team || '?'}
            </Button>
          </GridItemWrapper>
        ))}
      </GridWrapper>
    </Wrapper>
  );
};

export default Lobby;
