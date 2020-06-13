import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

import resign from 'actions/resign';
import { getCurrentPlayer } from 'reducers';

const ResignButton = () => {
  const dispatch = useDispatch();

  const currentPlayer = useSelector(state => getCurrentPlayer(state));
  const gameSlug = useSelector(state => state.gameSlug);

  const send = () => {
    dispatch(resign.send({ gameSlug, username: currentPlayer.name }));
  };

  return (
    <Button onClick={send}>
      <Icon fitted name="flag outline" />
    </Button>
  );
};

export default ResignButton;
