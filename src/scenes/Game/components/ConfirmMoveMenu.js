import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'actions';
import createMoveOnServer from 'actions/createMoveOnServer';
import { getLastMove } from 'reducers';

import isEqual from 'lodash/isEqual';

import ConfirmMenu from 'components/ConfirmMenu';

const ConfirmMoveMenu = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const showConfirmMoveMenu = useSelector(state => state.showConfirmMoveMenu);
  const lastMove = useSelector(state => getLastMove(state), isEqual);
  const username = useSelector(state => state.username);

  const confirmPosition = useCallback(async () => {
    dispatch(
      createMoveOnServer({
        gameSlug,
        id: lastMove.id,
        move: lastMove.move,
        username,
      }),
    );
    dispatch(actions.game.showConfirmMoveMenu.set(false));
  }, [dispatch, gameSlug, lastMove.id, lastMove.move, username]);

  const cancelPosition = useCallback(() => {
    dispatch(actions.game.showConfirmMoveMenu.set(false));
    dispatch(actions.game.positions.remove(lastMove.id));
  }, [dispatch, lastMove.id]);

  return (
    <ConfirmMenu
      label="Confirm move?"
      yesHandler={confirmPosition}
      noHandler={cancelPosition}
      show={showConfirmMoveMenu}
      disabled={gameSlug === null}
    />
  );
};

export default ConfirmMoveMenu;
