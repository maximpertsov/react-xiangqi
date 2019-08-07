import React, { useCallback, useEffect, useState } from 'react';
import Game from './Game/Game';
import 'babel-polyfill';
import LoginForm from './LoginForm/LoginForm';
import * as client from './client';

const SOLO = 'solo';

const App = () => {
  const [username, setUsername] = useState(undefined);
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

  const queryParams = new URLSearchParams(window.location.search);
  const gameSlug = queryParams.get('game') || undefined;

  switch (gameSlug) {
    case undefined:
      return (
        <div>
          <LoginForm setUsername={setUsername} />
          <br />
          {games.map((game) => <div key={game.slug}>{game.slug}</div>)}
        </div>
      );
    case SOLO:
      return <Game />;
    default:
      return (
        <Game
          gameSlug={gameSlug}
          username={username}
          setUsername={setUsername}
        />
      );
  }
};

export default App;
