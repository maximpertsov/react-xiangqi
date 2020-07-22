import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

import actions from 'actions';
import resign from 'actions/resign';
import { getCurrentPlayer } from 'reducers';
import { WebSocketContext } from 'services/websockets';

const TIME_TO_CONFIRM = 2000;

const ResignButton = () => {
  const dispatch = useDispatch();
  const io = useContext(WebSocketContext);

  const confirmingResign = useSelector(state => state.confirmingResign);
  const currentPlayer = useSelector(state => getCurrentPlayer(state));
  const gameSlug = useSelector(state => state.gameSlug);

  const send = () => {
    dispatch(actions.game.confirmingResign.set(true));
    setTimeout(() => {
      dispatch(actions.game.confirmingResign.set(false));
    }, TIME_TO_CONFIRM);
  };

  const confirmSend = () => {
    dispatch(resign.send({ io, gameSlug, username: currentPlayer.name }));
    dispatch(actions.game.confirmingResign.set(false));
  };

  const renderConfirmButton = () => (
    <Button
      circular
      color="yellow"
      icon
      labelPosition="left"
      onClick={confirmSend}
    >
      <Icon fitted name="flag outline" />
      Confirm?
    </Button>
  );

  const renderButton = () => (
    <Button onClick={send}>
      <Icon fitted name="flag outline" />
    </Button>
  );

  if (confirmingResign) return renderConfirmButton();
  return renderButton();
};

export default ResignButton;
