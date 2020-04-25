import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import { cancelMoves, confirmMoves, postMove } from 'actions';

import { getHasPendingPosition } from 'reducers';

import ConfirmMenu from 'components/ConfirmMenu';

const ConfirmPositionMenu = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const hasPendingPosition = useSelector(state => getHasPendingPosition(state));
  const pendingPositionId = useSelector(state => state.pendingPositionId);
  // const username = useSelector(state => state.username);

  const confirmPosition = useCallback(async () => {
    dispatch({ type: 'update_pending_position', value: null });

    // TODO: Post to server
  }, [dispatch]);

  const cancelPosition = useCallback(() => {
    dispatch({ type: 'remove_position', id: pendingPositionId });
  }, [dispatch, pendingPositionId]);

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
