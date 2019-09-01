import React from 'react';
import PropTypes from 'prop-types';
import GameMenu from './GameMenu';

const ConfirmMenu = ({ yesHandler, noHandler, show }) => {
  if (!show) return null;

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
  show: PropTypes.bool,
};

ConfirmMenu.defaultProps = {
  yesHandler: () => {},
  noHandler: () => {},
  show: true,
};

export default ConfirmMenu;
