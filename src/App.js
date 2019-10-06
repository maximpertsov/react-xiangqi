import 'babel-polyfill';
import 'semantic-ui-css/semantic.min.css';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Divider, Grid, Segment } from 'semantic-ui-react';

import { MenuButton } from './commonStyles';
import Game from './Game/Game';
import GameList from './Game/GameList';
import LoginForm from './LoginForm/LoginForm';
import * as client from './client';

const LOCAL = 'local';

const App = () => {
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
          <Segment placeholder>
            <Grid columns={2} relaxed="very" stackable>
              <Grid.Column>
                <LoginForm setUsername={setUsername} />
              </Grid.Column>

              <Grid.Column verticalAlign="middle">
                <Button content="Sign up" icon="signup" size="big" />
              </Grid.Column>
            </Grid>

            <Divider vertical>Or</Divider>
          </Segment>
          <Segment placeholder>
            <GameList setGameSlug={setGameSlug} games={games} />
          </Segment>
          <Segment placeholder>
            Other modes
            <div>
              <MenuButton onClick={() => { setGameSlug(LOCAL); }}>
                  Local Play
              </MenuButton>
            </div>
          </Segment>
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

export default App;
