import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cancelMoves, confirmMoves, postMove } from 'actions';
import { getLastMove } from 'reducers';

import isEqual from 'lodash/isEqual';

import ConfirmMenu from 'components/ConfirmMenu';

const ConfirmMoveMenu = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const lastMove = useSelector(state => getLastMove(state), isEqual);
  const username = useSelector(state => state.username);

  const confirmGameMove = useCallback(() => {
    dispatch(postMove({ gameSlug, move: lastMove, username }));
    dispatch(confirmMoves());
  }, [dispatch, gameSlug, lastMove, username]);

  const confirmMove = useCallback(async () => {
    if (!lastMove.pending) return;

    confirmGameMove();
  }, [confirmGameMove, lastMove.pending]);

  const cancelMove = useCallback(() => {
    dispatch(cancelMoves());
  }, [dispatch]);

  return (
    <ConfirmMenu
      label="Confirm move?"
      yesHandler={confirmMove}
      noHandler={cancelMove}
      show={lastMove.pending}
      disabled={gameSlug === null}
    />
  );
};

export default ConfirmMoveMenu;
