import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchGame, fetchMoves, pollMoves } from 'actions';
import { getMoveCount, getNextMovePlayer } from 'reducers';

const POLLING_INTERVAL = 2500;

const GameClient = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
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
      const interval = setInterval(() => {
        dispatch(
          pollMoves({
            gameSlug,
            moves,
            moveCount,
            nextMovePlayer,
            username,
          }),
        );
      }, POLLING_INTERVAL);
      return () => clearInterval(interval);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, gameSlug, nextMovePlayer, username],
  );

  return null;
};

export default GameClient;