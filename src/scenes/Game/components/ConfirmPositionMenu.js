import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { postMove } from 'actions';
import { getHasPendingPosition, getLastMove } from 'reducers';

import isEqual from 'lodash/isEqual';

import ConfirmMenu from 'components/ConfirmMenu';

const ConfirmPositionMenu = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const hasPendingPosition = useSelector(state => getHasPendingPosition(state));
  const lastMove = useSelector(state => getLastMove(state), isEqual);
  const username = useSelector(state => state.username);

  const confirmPosition = useCallback(
    async () => {
      dispatch(postMove({ gameSlug, move: lastMove, username }));
      dispatch({ type: 'update_pending_position', value: null });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, gameSlug, lastMove.id, username],
  );

  const cancelPosition = useCallback(() => {
    dispatch({ type: 'update_pending_position', value: null });
    dispatch({ type: 'remove_position', id: lastMove.id });
  }, [dispatch, lastMove.id]);

  return (
    <ConfirmMenu
      label="Confirm move?"
      yesHandler={confirmPosition}
      noHandler={cancelPosition}
      show={hasPendingPosition}
      disabled={gameSlug === null}
    />
  );
};

export default ConfirmPositionMenu;
