import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { Button, Icon } from 'semantic-ui-react';
import isEqual from 'lodash/isEqual';

import actions from 'actions';
import draw from 'actions/draw';
import { getCurrentPlayer, getOpponent } from 'reducers';
import { WebSocketContext } from 'services/websockets';

const TIME_TO_CONFIRM = 2000;

const mapStateToProps = createSelector(
  state => state,

  state => ({
    confirmingDraw: state.confirmingDraw,
    currentPlayer: getCurrentPlayer(state),
    gameSlug: state.gameSlug,
    openDrawOffer: state.openDrawOffer,
    opponent: getOpponent(state),
  }),
);

const DrawButton = () => {
  const dispatch = useDispatch();
  const io = useContext(WebSocketContext);

  const {
    confirmingDraw,
    currentPlayer,
    gameSlug,
    openDrawOffer,
    opponent,
  } = useSelector(mapStateToProps, isEqual);

  const request = () => {
    dispatch(actions.game.confirmingDraw.set(true));
    setTimeout(() => {
      dispatch(actions.game.confirmingDraw.set(false));
    }, TIME_TO_CONFIRM);
  };

  const confirmRequest = () => {
    dispatch(draw.request({ gameSlug, io, username: currentPlayer.name }));
    dispatch(actions.game.confirmingDraw.set(false));
  };

  const reject = () => {
    dispatch(draw.reject({ gameSlug, io, username: currentPlayer.name }));
  };

  const cancel = () => {
    dispatch(draw.cancel({ gameSlug, io, username: currentPlayer.name }));
  };

  const accept = () => {
    dispatch(draw.accept({ gameSlug, io, username: currentPlayer.name }));
  };

  const renderButton = () => (
    <Button onClick={request}>
      <Icon fitted name="handshake outline" />
    </Button>
  );

  const renderConfirmButton = () => (
    <Button
      circular
      color="yellow"
      icon
      labelPosition="left"
      onClick={confirmRequest}
    >
      <Icon fitted name="handshake outline" />
      Confirm?
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
  if (confirmingDraw) return renderConfirmButton();
  return renderButton();
};

export default DrawButton;
