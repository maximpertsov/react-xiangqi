import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import isEqual from 'lodash/isEqual';

import actions from 'actions';
import fetchUserGames from 'actions/fetchUserGames';
import { getLastMessage } from 'reducers/selectors';
import Game from 'scenes/Game';

import GameList from './components/GameList';
import Lobby from './components/Lobby';
import LoginForm from './components/LoginForm';
import NewGameMenu from './components/NewGameMenu';

const mapStateToProps = createSelector(
  [state => state],

  state => ({
    lastMessage: getLastMessage(state),
    showGame: state.showGame,
    username: state.username,
  }),
);

const Home = () => {
  const dispatch = useDispatch();

  const { lastMessage, showGame, username } = useSelector(
    mapStateToProps,
    isEqual,
  );

  useEffect(() => {
    dispatch(fetchUserGames({ username }));
  }, [dispatch, username]);

  useEffect(() => {
    if (!lastMessage) return;
    const { type, payload } = lastMessage;

    if (type !== 'joined_lobby_game') return;
    if (!payload.players.includes(username)) return;

    dispatch(actions.game.slug.set(payload.game));
    dispatch(actions.home.showGame.set(true));
  }, [dispatch, lastMessage, username]);

  const renderMenu = () => (
    <Container textAlign="center">
      <Segment.Group compact>
        <Segment>
          <Header size="large">Play online</Header>
          <LoginForm />
        </Segment>
        {username && (
          <Segment>
            <GameList />
          </Segment>
        )}
        {username && (
          <Segment>
            <NewGameMenu />
          </Segment>
        )}
        {username && (
          <Segment>
            <Lobby />
          </Segment>
        )}
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
