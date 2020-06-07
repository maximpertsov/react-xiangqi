import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import requestTakeback from 'actions/requestTakeback';
import cancelTakeback from 'actions/cancelTakeback';

const TakebackButton = () => {
  const dispatch = useDispatch();

  const gameSlug = useSelector(state => state.gameSlug);
  const requestedTakeback = useSelector(state => state.requestedTakeback);
  const username = useSelector(state => state.username);

  const sendTakebackRequest = useCallback(() => {
    dispatch(requestTakeback({ gameSlug, username }));
  }, [dispatch, gameSlug, username]);

  const cancelTakebackRequest = useCallback(() => {
    dispatch(cancelTakeback({ gameSlug, username }));
  }, [dispatch, gameSlug, username]);

  const renderTakebackButton = () => (
    <Button onClick={sendTakebackRequest}>
      <Icon fitted name="undo" />
    </Button>
  );

  const renderCancelTakebackButton = () => (
    <Button
      color="red"
      icon
      labelPosition="left"
      onClick={cancelTakebackRequest}
    >
      <Icon name="undo" />
      Cancel
    </Button>
  );

  if (requestedTakeback) return renderCancelTakebackButton();
  return renderTakebackButton();
};

export default TakebackButton;
