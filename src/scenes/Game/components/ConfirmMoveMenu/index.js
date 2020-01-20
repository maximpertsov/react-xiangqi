import React from 'react';
import PropTypes from 'prop-types';

import ConfirmMenu from 'components/ConfirmMenu';

const ConfirmMoveMenu = ({
  yesHandler, noHandler, show, disabled,
}) => {

  return (
    <ConfirmMenu
      yesHandler={yesHandler}
      noHandler={noHandler}
      show={show}
      disabled={disabled}
    />
  );
};

ConfirmMoveMenu.propTypes = {
  yesHandler: PropTypes.func,
  noHandler: PropTypes.func,
  show: PropTypes.bool,
  disabled: PropTypes.bool,
};

ConfirmMoveMenu.defaultProps = {
  yesHandler: () => {},
  noHandler: () => {},
  show: true,
  disabled: false,
};

export default ConfirmMoveMenu;
