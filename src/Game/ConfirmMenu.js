import React from 'react';
import PropTypes from 'prop-types';
import GameMenu from './GameMenu';

const ConfirmMenu = ({ yesHandler, noHandler }) => {
  const actions = [
    { icon: 'Confirm move?' },
    { icon: '\u2705', callback: yesHandler },
    { icon: '\u274C', callback: noHandler },
  ];
  return <GameMenu actions={actions} />;
};

ConfirmMenu.propTypes = {
  yesHandler: PropTypes.func,
  noHandler: PropTypes.func,
};

ConfirmMenu.defaultProps = {
  yesHandler: () => {},
  noHandler: () => {},
};

export default ConfirmMenu;
