import 'babel-polyfill';
import React, { useCallback, useEffect, useState } from 'react';
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
        <div>
          <LoginForm setUsername={setUsername} />
          <br />
          <GameList setGameSlug={setGameSlug} games={games} />
          <br />
          <MenuButton onClick={() => { setGameSlug(LOCAL); }}>
            Local Play
          </MenuButton>
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
