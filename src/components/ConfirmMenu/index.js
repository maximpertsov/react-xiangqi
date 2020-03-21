import React from 'react';
import PropTypes from 'prop-types';
import useEventListener from '@use-it/event-listener';
import { Button, Icon, Label, Segment } from 'semantic-ui-react';

import GameMenu from 'components/GameMenu';

const ConfirmMenu = ({ yesHandler, noHandler, show, disabled }) => {
  useEventListener('keydown', ({ key }) => {
    if (!show) return;

    switch (key) {
      case 'Enter':
        yesHandler();
        break;
      default:
        noHandler();
    }
  });

  if (disabled) {
    yesHandler();
    return null;
  }

  if (!show) return null;

  return (
    <Segment>
      <Label attached='top'>Confirm move?</Label>
      <GameMenu>
        <Button color="green" onClick={yesHandler}>
          <Icon fitted name="check" />
        </Button>
        <Button color="red" onClick={noHandler}>
          <Icon fitted name="x" />
        </Button>
      </GameMenu>
    </Segment>
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
