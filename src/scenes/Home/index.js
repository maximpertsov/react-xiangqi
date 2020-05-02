import React, { useEffect } from 'react';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import actions, { fetchGames } from 'actions';

import Game from 'scenes/Game';

import GameList from './components/GameList';
import LoginForm from './components/LoginForm';

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
              dispatch(actions.home.autoMove.set.off());
              dispatch(actions.home.showGame.set(true));
              dispatch(actions.game.canMoveBothColors.set(true));
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
