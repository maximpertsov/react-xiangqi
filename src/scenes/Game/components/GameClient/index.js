import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchGame, fetchMoves } from 'actions';
import { getMoveCount } from 'reducers';

// TODO: move client to this level or remove?
import * as client from '../../services/client';
// TODO: move this into selectors collocated with reducers
import { getNextMovePlayer } from '../../selectors';

const GameClient = ({ children }) => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const loading = useSelector(state => state.loading);
  const moves = useSelector(state => state.moves);
  const moveCount = useSelector(state => getMoveCount(state));
  const nextMovePlayer = useSelector(state => getNextMovePlayer(state));
  const username = useSelector(state => state.username);

  useEffect(() => {
    dispatch(fetchGame({ gameSlug }));
  }, [dispatch, gameSlug]);

  useEffect(
    () => {
      dispatch(fetchMoves({ gameSlug, moves }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, gameSlug],
  );

  useEffect(
    () => {
      const interval = client.setPollMovesInterval({
        dispatch,
        gameSlug,
        loading,
        moveCount,
        nextMovePlayer,
        username,
      });
      return () => clearInterval(interval);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, gameSlug, username],
  );

  return <div>{children}</div>;
};

GameClient.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GameClient;
