import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchInitialPlacement, fetchMoveInfo } from 'actions';
import fetchGame from 'actions/fetchGame';
import pollMoves from 'actions/pollMoves';
import {
  getHasInitialPlacement,
  getNextMovePlayer,
  getMissingLegalMovesPayload,
  getMoveCount,
} from 'reducers';

const POLLING_INTERVAL = 2500;

const GameClient = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const hasInitialPlacement = useSelector(state =>
    getHasInitialPlacement(state),
  );
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
    if (hasInitialPlacement) return;

    dispatch(fetchInitialPlacement());
  }, [dispatch, hasInitialPlacement]);

  useEffect(
    () => {
      if (!hasInitialPlacement) return;
      if (!missingLegalMovesPayload) return;

      dispatch(fetchMoveInfo(missingLegalMovesPayload));
      // HACK: too many updates because missing legal moves is an object and
      // useEffect is doing a deep comparison. To get around this, we exclude it
      // from the comparison and key on the move count.
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, hasInitialPlacement, moveCount],
  );

  useEffect(() => {
    if (!hasInitialPlacement) return;

    const interval = setInterval(() => {
      dispatch(
        pollMoves({
          gameSlug,
          nextMovePlayer,
          updateCount,
          username,
        }),
      );
    }, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [
    dispatch,
    gameSlug,
    hasInitialPlacement,
    nextMovePlayer,
    updateCount,
    username,
  ]);

  return null;
};

export default GameClient;
