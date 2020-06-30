import React, { useEffect } from 'react';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'actions';
import fetchUserGames from 'actions/fetchUserGames';

import Game from 'scenes/Game';

import GameList from './components/GameList';
import LoginForm from './components/LoginForm';
import NewGameButton from './components/NewGameButton';
import Lobby from './components/Lobby';

const Home = () => {
  const dispatch = useDispatch();
  const showGame = useSelector(state => state.showGame);
  const username = useSelector(state => state.username);

  useEffect(() => {
    dispatch(fetchUserGames({ username }));
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
          <Header size="medium">Create game</Header>
          <NewGameButton />
        </Segment>
        <Segment>
          <Lobby />
        </Segment>
        <Segment>
          <Header size="large">Other modes</Header>
          <Button
            onClick={() => {
              dispatch(actions.home.autoMove.set.off());
              dispatch(actions.home.showGame.set(true));
              dispatch(actions.game.canMoveBothTeams.set(true));
            }}
          >
            Solo play
          </Button>
          <Button
            onClick={() => {
              dispatch(actions.home.autoMove.set.black());
              dispatch(actions.home.showGame.set(true));
            }}
          >
            vs CPU
          </Button>
          <Button
            onClick={() => {
              dispatch(actions.home.autoMove.set.both());
              dispatch(actions.home.showGame.set(true));
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
