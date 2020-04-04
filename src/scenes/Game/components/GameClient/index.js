import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchInitialPlacement,
  fetchMoveInfo,
  fetchGame,
  toggleMovesFetched,
} from 'actions';
import fetchMoves from 'actions/fetchMoves';
import pollMoves from 'actions/pollMoves';
import {
  getMoveCount,
  getNextMovePlayer,
  getMissingLegalMovesPayload,
} from 'reducers';

const POLLING_INTERVAL = 2500;

const GameClient = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const moves = useSelector(state => state.moves);
  const moveCount = useSelector(state => getMoveCount(state));
  const nextMovePlayer = useSelector(state => getNextMovePlayer(state));
  const missingLegalMovesPayload = useSelector(state =>
    getMissingLegalMovesPayload(state),
  );
  const updateCount = useSelector(state => state.updateCount);
  const username = useSelector(state => state.username);

  useEffect(() => {
    dispatch(fetchGame({ gameSlug }));
  }, [dispatch, gameSlug]);

  useEffect(() => {
    if (moveCount > -1) return;

    dispatch(fetchInitialPlacement());
  }, [dispatch, moveCount]);

  useEffect(
    () => {
      if (moveCount < 0) return;
      if (missingLegalMovesPayload === undefined) return;

      dispatch(fetchMoveInfo(missingLegalMovesPayload));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, moveCount],
  );

  useEffect(
    () => {
      if (gameSlug === null) {
        // TODO: hack, add a moves "fetching" state instead?
        dispatch(toggleMovesFetched());
        return;
      }
      if (moveCount > -1) return;

      dispatch(fetchMoves({ gameSlug, moves }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, gameSlug],
  );

  useEffect(
    () => {
      if (moveCount === -1) return;

      const interval = setInterval(() => {
        dispatch(
          pollMoves({
            gameSlug,
            moves,
            nextMovePlayer,
            updateCount,
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
