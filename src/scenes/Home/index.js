import React, { useEffect, useState } from "react";
import { Button, Container, Header, Segment } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";

import { fetchGames } from "actions";

import Game from "scenes/Game";

import GameList from "./components/GameList";
import LoginForm from "./components/LoginForm";

// TODO: absolute import?
import { AutoMove } from "../../constants";

const MENU = "menu";
const PLAYER_VS_CPU = "player_vs_cpu";
const CPU_VS_CPU = "cpu_vs_cpu";

const Home = () => {
  // TODO: Consider making this part of global state
  const [gameType, setGameType] = useState(MENU);

  const dispatch = useDispatch();
  const gameSlug = useSelector(state => state.gameSlug);
  const username = useSelector(state => state.username);

  useEffect(() => {
    dispatch(fetchGames({ username }));
  }, [dispatch, username]);

  const renderMenu = () => (
    <Container textAlign="center">
      <Segment.Group compact>
        <Segment>
          <Header size="large">Play online</Header>
          <LoginForm />
          {username !== null && <GameList />}
        </Segment>
        <Segment>
          <Header size="large">Other modes</Header>
          <Button
            onClick={() => {
              setGameType(null);
            }}
          >
            Solo play
          </Button>
          <Button
            onClick={() => {
              setGameType(PLAYER_VS_CPU);
            }}
          >
            vs CPU
          </Button>
          <Button
            onClick={() => {
              setGameType(CPU_VS_CPU);
            }}
          >
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
