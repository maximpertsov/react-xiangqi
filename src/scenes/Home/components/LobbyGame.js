import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';

import client from 'services/client';
import { WebSocketContext } from 'services/WebSocketProvider';

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
    <Button className="LobbyGame" onClick={joinGame(id)} fluid>
      {`vs ${parameters.team || '?'}`}
    </Button>
  );
};

LobbyGame.propTypes = {
  id: PropTypes.number.isRequired,
  parameters: PropTypes.shape().isRequired,
};

export default LobbyGame;
