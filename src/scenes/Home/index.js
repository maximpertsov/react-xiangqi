import React, { useEffect } from 'react';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import last from 'lodash/last';

import actions from 'actions';
import fetchUserGames from 'actions/fetchUserGames';

import Game from 'scenes/Game';

import GameList from './components/GameList';
import LoginForm from './components/LoginForm';
import NewGameMenu from './components/NewGameMenu';
import Lobby from './components/Lobby';

const mapStateToProps = createSelector(
  [state => state],

  state => ({
    messages: state.messages,
    showGame: state.showGame,
    username: state.username,
  }),
);

const Home = () => {
  const dispatch = useDispatch();

  const { messages, showGame, username } = useSelector(
    mapStateToProps,
    isEqual,
  );

  useEffect(() => {
    dispatch(fetchUserGames({ username }));
  }, [dispatch, username]);

  useEffect(() => {
    const lastMessage = last(messages);

    if (lastMessage && lastMessage.type === 'joined_lobby_game') {
      const { game } = lastMessage;
      dispatch(actions.game.slug.set(game));
      dispatch(actions.home.showGame.set(true));
    }
  }, [dispatch, messages, username]);

  const renderMenu = () => (
    <Container textAlign="center">
      <Segment.Group compact>
        <Segment>
          <Header size="large">Play online</Header>
          <LoginForm />
          {username && <GameList />}
        </Segment>
        <Segment>
          <Header size="medium">Create game</Header>
          {username && <NewGameMenu />}
        </Segment>
        <Segment>{username && <Lobby />}</Segment>
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
