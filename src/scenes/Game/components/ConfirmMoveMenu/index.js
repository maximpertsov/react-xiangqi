import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cancelMoves, confirmMoves, postMove, selectMove } from 'actions';
import { getLastMove, getPreviousMove } from 'reducers';

import ConfirmMenu from 'components/ConfirmMenu';

const ConfirmMoveMenu = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const lastMove = useSelector(state => getLastMove(state));
  const moves = useSelector(state => state.moves);
  const previousMove = useSelector(state => getPreviousMove(state));
  const username = useSelector(state => state.username);

  const confirmMove = useCallback(async () => {
    const { move, pending } = lastMove;
    if (!pending) return;

    dispatch(postMove({ gameSlug, move, moves, username }));
    dispatch(confirmMoves());
  }, [dispatch, gameSlug, lastMove, moves, username]);

  const cancelMove = useCallback(() => {
    // HACK: select previous move before dropping the cancelled move
    dispatch(selectMove({ moveId: previousMove.id }));
    dispatch(cancelMoves());
  }, [dispatch, previousMove.id]);

  return (
    <ConfirmMenu
      yesHandler={confirmMove}
      noHandler={cancelMove}
      show={lastMove.pending}
      disabled={gameSlug === null}
    />
  );
};

export default ConfirmMoveMenu;
