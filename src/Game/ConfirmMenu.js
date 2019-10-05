import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import GameMenu from './GameMenu';

const ConfirmMenu = ({ yesHandler, noHandler, show }) => {
  if (!show) return null;

  return (
    <GameMenu>
      <Button inverted color="green" onClick={yesHandler}>Confirm</Button>
      <Button inverted color="red" onClick={noHandler}>Cancel</Button>
    </GameMenu>
  );
};

ConfirmMenu.propTypes = {
  yesHandler: PropTypes.func,
  noHandler: PropTypes.func,
  show: PropTypes.bool,
};

ConfirmMenu.defaultProps = {
  yesHandler: () => {},
  noHandler: () => {},
  show: true,
};

export default ConfirmMenu;
