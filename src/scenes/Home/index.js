import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import Game from 'scenes/Game';
import * as client from 'services/client';

import GameList from './components/GameList';
import LoginForm from './components/LoginForm';

// TODO: absolute import?
import { AutoMove } from '../../constants';

const MENU = 'menu';
const PLAYER_VS_CPU = 'player_vs_cpu';
const CPU_VS_CPU = 'cpu_vs_cpu';

const Home = () => {
  const gameSlug = useSelector((state) => state.gameSlug);
  const username = useSelector((state) => state.username);

  // TODO: move to global state?
  const [gameType, setGameType] = useState(MENU);
  const [games, setGames] = useState([]);

  const fetchGames = useCallback(
    async() => {
      const response = await client.getGameList({ username });
      setGames(response.data.games);
    },
    [username],
  );

  useEffect(
    () => {
      if (username === null) return;
      fetchGames();
    },
    [fetchGames, username],
  );

  const renderGameList = () => {
    if (username !== null) {
      return <GameList games={games} />;
    }
  };

  const renderMenu = () => (
    <Container textAlign="center">
      <Segment.Group compact>
        <Segment>
          <Header size="large">Play online</Header>
          <LoginForm />
          { renderGameList() }
        </Segment>
        <Segment>
          <Header size="large">Other modes</Header>
          <Button onClick={() => { setGameType(null); }}>
            Solo play
          </Button>
          <Button onClick={() => { setGameType(PLAYER_VS_CPU); }}>
            vs CPU
          </Button>
          <Button onClick={() => { setGameType(CPU_VS_CPU); }}>
            CPU vs CPU
          </Button>
        </Segment>
      </Segment.Group>
    </Container>
  );

  switch (gameType) {
  case MENU:
    if (gameSlug) return <Game />;
    return renderMenu();
  case PLAYER_VS_CPU:
    return <Game autoMove={AutoMove.BLACK} />;
  case CPU_VS_CPU:
    return <Game autoMove={AutoMove.BOTH} />;
  default:
    return <Game />;
  }
};

export default Home;
