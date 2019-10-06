/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import 'semantic-ui-css/semantic.min.css';
import 'babel-polyfill';
import { useCallback, useEffect, useState } from 'react';
import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react';

import { MenuButton } from './commonStyles';
import Game from './Game/Game';
import GameList from './Game/GameList';
import LoginForm from './LoginForm/LoginForm';
import * as client from './client';

const LOCAL = 'local';
const BETA = 'beta';

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
        <div
          css={css`
            width:200px;
          `}
        >
          <LoginForm setUsername={setUsername} />
          <GameList setGameSlug={setGameSlug} games={games} />

          <div
            css={css`
              border:1px #CCC solid;
              margin-top: 15px;
              margin-bottom: 15px;
              padding: 5px;
              width: 100%;
            `}
          >
            Other modes
            <div>
              <MenuButton onClick={() => { setGameSlug(LOCAL); }}>
                Local Play
              </MenuButton>
            </div>
          </div>
        </div>
      );
    case BETA:
      return (
        <Segment placeholder>
          <Grid columns={2} relaxed="very" stackable>
            <Grid.Column>
              <Form>
                <Form.Input
                  icon="user"
                  iconPosition="left"
                  label="Username"
                  placeholder="Username"
                />
                <Form.Input
                  icon="lock"
                  iconPosition="left"
                  label="Password"
                  type="password"
                />

                <Button content="Login" primary />
              </Form>
            </Grid.Column>

            <Grid.Column verticalAlign="middle">
              <Button content="Sign up" icon="signup" size="big" />
            </Grid.Column>
          </Grid>

          <Divider vertical>Or</Divider>
        </Segment>
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
