import React from 'react';
import PropTypes from 'prop-types';
import useEventListener from '@use-it/event-listener';
import { Button } from 'semantic-ui-react';
import GameMenu from './GameMenu';

const ConfirmMenu = ({
  yesHandler, noHandler, show, disabled,
}) => {
  useEventListener(
    'keydown',
    ({ key }) => {
      if (!show) return;

      switch (key) {
        case 'Enter':
          yesHandler();
          break;
        default:
          noHandler();
      }
    },
  );

  if (disabled) {
    yesHandler();
    return null;
  }

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
  disabled: PropTypes.bool,
};

ConfirmMenu.defaultProps = {
  yesHandler: () => {},
  noHandler: () => {},
  show: true,
  disabled: false,
};

export default ConfirmMenu;
