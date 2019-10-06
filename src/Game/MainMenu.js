import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Header, Segment } from 'semantic-ui-react';

import Game from './Game';
import GameList from './GameList';
import LoginForm from '../LoginForm/LoginForm';
import * as client from '../client';

const LOCAL = 'local';

const MainMenu = () => {
  const [username, setUsername] = useState(undefined);
  const [gameSlug, setGameSlug] = useState(undefined);
  const [games, setGames] = useState([]);

  const fetchGames = useCallback(
    () => {
      client.getGameList(username)
        .then((response) => { setGames(response.data.games); });
    },
    [username],
  );

  useEffect(
    () => {
      if (username === undefined) return;
      fetchGames();
    },
    [fetchGames, username],
  );

  switch (gameSlug) {
    case undefined:
      return (
        <Container textAlign="center">
          <Segment.Group>
            <Segment>
              <Header size="large">Play online</Header>
              <LoginForm setUsername={setUsername} />
              { username === undefined ||
                <GameList setGameSlug={setGameSlug} games={games} />
              }
            </Segment>
            <Segment>
              <Header size="large">Other modes</Header>
              <Button onClick={() => { setGameSlug(LOCAL); }}>
                Local Play
              </Button>
            </Segment>
          </Segment.Group>
        </Container>
      );
    case LOCAL:
      return <Game />;
    default:
      return (
        <Game
          gameSlug={gameSlug}
          username={username}
        />
      );
  }
};

export default MainMenu;
