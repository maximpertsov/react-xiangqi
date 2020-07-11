import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Button } from 'semantic-ui-react';

import client from 'services/client';
import { WebSocketContext } from 'services/WebSocketProvider';

const Wrapper = styled.div`
  padding: 5px;
`;

const LobbyGame = ({ id, parameters }) => {
  const io = useContext(WebSocketContext);
  const username = useSelector(state => state.username);

  const joinGame = id => () => {
    client
      .patch(`game/request/${id}`, {
        player2: username,
      })
      .then(({ data: { game, player1, player2 } }) => {
        if (!game) return;

        io.send({
          type: 'joined_lobby_game',
          game,
          players: [player1, player2],
        });
      });
  };

  return (
    <Wrapper className="LobbyGame">
      <Button onClick={joinGame(id)} fluid className="GameLink">
        {`vs ${parameters.team || '?'}`}
      </Button>
    </Wrapper>
  );
};

LobbyGame.propTypes = {
  id: PropTypes.number.isRequired,
  parameters: PropTypes.shape().isRequired,
};

export default LobbyGame;
