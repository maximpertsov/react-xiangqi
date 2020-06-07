import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

// TODO: move to own module
import client from 'services/client';

import actions from 'actions';
import { getCurrentPlayer, getOpponent } from 'reducers';

const DrawButton = () => {
  const dispatch = useDispatch();

  const currentPlayer = useSelector(state => getCurrentPlayer(state));
  const gameSlug = useSelector(state => state.gameSlug);
  const openDrawOffer = useSelector(state => state.openDrawOffer);
  const opponent = useSelector(state => getOpponent(state));

  // TODO: move to own module
  const send = useCallback(() => {
    dispatch(actions.game.openDrawOffer.set(currentPlayer.name));

    if (gameSlug) {
      const payload = {
        game: gameSlug,
        name: 'offered_draw',
        payload: { username: currentPlayer.name },
      };
      client.post(`game/events`, payload);
    }
  }, [currentPlayer.name, dispatch, gameSlug]);

  // TODO: move to own module
  const reject = useCallback(() => {
    dispatch(actions.game.openDrawOffer.set(null));

    if (gameSlug) {
      const payload = {
        game: gameSlug,
        name: 'rejected_draw',
        payload: { username: currentPlayer.name },
      };
      client.post(`game/events`, payload);
    }
  }, [currentPlayer.name, dispatch, gameSlug]);

  // TODO: move to own module
  const cancel = useCallback(() => {
    dispatch(actions.game.openDrawOffer.set(null));

    if (gameSlug) {
      const payload = {
        game: gameSlug,
        name: 'canceled_draw',
        payload: { username: currentPlayer.name },
      };
      client.post(`game/events`, payload);
    }
  }, [currentPlayer.name, dispatch, gameSlug]);

  // TODO: move to own module
  const accept = useCallback(() => {
    dispatch(actions.game.openDrawOffer.set(null));

    if (gameSlug) {
      const payload = {
        game: gameSlug,
        name: 'accepted_draw',
        payload: { username: currentPlayer.name },
      };
      client.post(`game/events`, payload);
    }
  }, [currentPlayer.name, dispatch, gameSlug]);

  const renderButton = () => (
    <Button onClick={send}>
      <Icon fitted name="handshake outline" />
    </Button>
  );

  const renderCancelButton = () => (
    <Button color="red" icon labelPosition="left" onClick={cancel}>
      <Icon name="handshake outline" />
      Cancel
    </Button>
  );

  const renderAcceptOrRejectButton = () => (
    <Button.Group>
      <Button compact>
        <Icon name="handshake outline" />
      </Button>
      <Button color="green" onClick={accept}>
        Accept
      </Button>
      <Button color="red" onClick={reject}>
        Reject
      </Button>
    </Button.Group>
  );

  if (openDrawOffer === currentPlayer.name) return renderCancelButton();
  if (openDrawOffer === opponent.name) return renderAcceptOrRejectButton();
  return renderButton();
};

export default DrawButton;
