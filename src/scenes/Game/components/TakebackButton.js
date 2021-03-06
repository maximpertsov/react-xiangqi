import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

import takeback from 'actions/takeback';
import { getCurrentPlayer, getOpponent } from 'reducers';
import { WebSocketContext } from 'services/websockets';

const TakebackButton = () => {
  const dispatch = useDispatch();
  const io = useContext(WebSocketContext);

  const currentPlayer = useSelector(state => getCurrentPlayer(state));
  const gameSlug = useSelector(state => state.gameSlug);
  const openTakebackOffer = useSelector(state => state.openTakebackOffer);
  const opponent = useSelector(state => getOpponent(state));

  const request = () => {
    dispatch(takeback.request({ io, gameSlug, username: currentPlayer.name }));
  };

  const reject = () => {
    dispatch(takeback.reject({ io, gameSlug, username: currentPlayer.name }));
  };

  const cancel = () => {
    dispatch(takeback.cancel({ io, gameSlug, username: currentPlayer.name }));
  };

  const accept = () => {
    dispatch(takeback.accept({ io, gameSlug, username: currentPlayer.name }));
  };

  const renderButton = () => (
    <Button onClick={request}>
      <Icon fitted name="undo" />
    </Button>
  );

  const renderCancelButton = () => (
    <Button color="red" icon labelPosition="left" onClick={cancel}>
      <Icon name="undo" />
      Cancel
    </Button>
  );

  const renderAcceptOrRejectButton = () => (
    <Button.Group>
      <Button compact>
        <Icon name="undo" />
      </Button>
      <Button color="green" onClick={accept}>
        Accept
      </Button>
      <Button color="red" onClick={reject}>
        Reject
      </Button>
    </Button.Group>
  );

  if (openTakebackOffer === currentPlayer.name) return renderCancelButton();
  if (openTakebackOffer === opponent.name) return renderAcceptOrRejectButton();
  return renderButton();
};

export default TakebackButton;
