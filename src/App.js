/** @jsx jsx */

import 'babel-polyfill';
import { jsx, css } from '@emotion/core';
import { useCallback, useEffect, useState } from 'react';
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
        <div>
          <LoginForm setUsername={setUsername} />
          <br />
          <GameList setGameSlug={setGameSlug} games={games} />
          <br />
          <button
            css={css`
              &:hover {
                color:hotpink;
              }
            `}
            onClick={() => { setGameSlug(LOCAL); }}
          >
            Local Play
          </button>
        </div>
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
