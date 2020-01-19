import React, { useEffect } from "react";
import { Button, Container, Header, Segment } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchGames,
  setAutoMoveOff,
  setAutoMoveBlack,
  setAutoMoveBoth,
} from "actions";

import Game from "scenes/Game";

import GameList from "./components/GameList";
import LoginForm from "./components/LoginForm";

const Home = () => {
  const dispatch = useDispatch();
  const showGame = useSelector(state => state.showGame);
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
              dispatch(setAutoMoveOff());
              dispatch({ type: "toggle_show_game", showGame: true });
            }}
          >
            Solo play
          </Button>
          <Button
            onClick={() => {
              dispatch(setAutoMoveBlack());
              dispatch({ type: "toggle_show_game", showGame: true });
            }}
          >
            vs CPU
          </Button>
          <Button
            onClick={() => {
              dispatch(setAutoMoveBoth());
              dispatch({ type: "toggle_show_game", showGame: true });
            }}
          >
            CPU vs CPU
          </Button>
        </Segment>
      </Segment.Group>
    </Container>
  );

  if (showGame) return <Game />;
  return renderMenu();
};

export default Home;
