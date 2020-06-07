import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

import actions from 'actions';
import { getCurrentPlayer } from 'reducers';

const DrawButton = () => {
  const dispatch = useDispatch();

  const openDrawOffer = useSelector(state => state.openDrawOffer);
  const currentPlayer = useSelector(state => getCurrentPlayer(state));

  const send = useCallback(() => {
    dispatch(actions.game.openDrawOffer.set(currentPlayer.name));
  }, [currentPlayer.name, dispatch]);

  const cancel = useCallback(() => {
    dispatch(actions.game.openDrawOffer.set(null));
  }, [dispatch]);

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

  if (openDrawOffer) return renderCancelButton();
  return renderButton();
};

export default DrawButton;
