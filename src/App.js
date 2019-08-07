import React, { useCallback, useEffect, useState } from 'react';
import Game from './Game/Game';
import 'babel-polyfill';
import LoginForm from './LoginForm/LoginForm';
import * as client from './client';

// const GAME_ID = 'ABC123';

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

  if (gameSlug === undefined) {
    return (
      <div>
        <LoginForm setUsername={setUsername} />
        {games.map((game) => <div>{game.slug}</div>)}
      </div>
    );
  }

  return (
    <div>
      <Game
        gameSlug={gameSlug}
        username={username}
        setUsername={setUsername}
      />
    </div>
  );
};

export default App;
