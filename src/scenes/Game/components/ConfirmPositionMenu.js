import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import createMoveOnServer from 'actions/createMoveOnServer';
import { getLastMove } from 'reducers';

import isEqual from 'lodash/isEqual';

import ConfirmMenu from 'components/ConfirmMenu';

const ConfirmPositionMenu = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const lastPositionIsPending = useSelector(
    state => state.lastPositionIsPending,
  );
  const lastMove = useSelector(state => getLastMove(state), isEqual);
  const username = useSelector(state => state.username);

  const confirmPosition = useCallback(
    async () => {
      dispatch(createMoveOnServer({ gameSlug, position: lastMove, username }));
      dispatch({ type: 'update_last_position_is_pending', value: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, gameSlug, lastMove.id, username],
  );

  const cancelPosition = useCallback(() => {
    dispatch({ type: 'update_last_position_is_pending', value: false });
    dispatch({ type: 'remove_position', id: lastMove.id });
  }, [dispatch, lastMove.id]);

  return (
    <ConfirmMenu
      label="Confirm move?"
      yesHandler={confirmPosition}
      noHandler={cancelPosition}
      show={lastPositionIsPending}
      disabled={gameSlug === null}
    />
  );
};

export default ConfirmPositionMenu;
