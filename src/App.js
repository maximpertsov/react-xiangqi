/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useState } from 'react';
import Game from './Game/Game';
import 'babel-polyfill';
import LoginForm from './LoginForm/LoginForm';

// const GAME_ID = 'ABC123';

const App = () => {
  const [username, setUsername] = useState(undefined);

  const queryParams = new URLSearchParams(window.location.search);
  const gameSlug = queryParams.get('game') || undefined;
  return (
    <div>
      <div
        css={css`
        display: flex;
        flex-direction: column;
      `}
      >
        <LoginForm setUsername={setUsername} />
        <Game
          gameSlug={gameSlug}
          username={username}
        />
      </div>
    </div>
  );
};

export default App;
