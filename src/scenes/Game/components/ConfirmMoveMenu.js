import React, { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';

import actions from 'actions';
import createMoveOnServer from 'actions/createMoveOnServer';
import ConfirmMenu from 'components/ConfirmMenu';
import { getLastMove, getSecondToLastMove } from 'reducers';
import { WebSocketContext } from 'services/websockets';

const ConfirmMoveMenu = () => {
  const dispatch = useDispatch();
  const io = useContext(WebSocketContext);

  const gameSlug = useSelector(state => state.gameSlug);
  const showConfirmMoveMenu = useSelector(state => state.showConfirmMoveMenu);
  const lastMove = useSelector(state => getLastMove(state), isEqual);
  const secondToLastMove = useSelector(
    state => getSecondToLastMove(state),
    isEqual,
  );
  const username = useSelector(state => state.username);

  const confirmMove = useCallback(async () => {
    dispatch(
      createMoveOnServer({
        gameSlug,
        io,
        uci: lastMove.uci,
        fen: lastMove.fen,
        username,
      }),
    );
    dispatch(actions.game.showConfirmMoveMenu.set(false));
  }, [dispatch, gameSlug, lastMove.uci, lastMove.fen, username, io]);

  const cancelMove = useCallback(() => {
    dispatch(actions.game.showConfirmMoveMenu.set(false));
    dispatch(actions.game.moves.remove(lastMove.fen));
    dispatch(actions.game.selectedFen.set(secondToLastMove.fen));
  }, [dispatch, lastMove.fen, secondToLastMove.fen]);

  return (
    <ConfirmMenu
      label="Confirm move?"
      yesHandler={confirmMove}
      noHandler={cancelMove}
      show={showConfirmMoveMenu}
      disabled={gameSlug === null}
    />
  );
};

export default ConfirmMoveMenu;
