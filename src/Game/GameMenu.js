/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

const ACTIONS = [
  { icon: '⋮' },
  { icon: '↩️' },
  { icon: '🔃' },
  { icon: '⏪' },
  { icon: '⏩' },
];

const GameMenu = ({ actions }) => (
  <div
    className="GameMenu"
    css={css`
        display: grid;
        grid-template-columns: repeat(${actions.length}, 1fr);
        text-align: center;
        align-items: center;
    `}
  >
    { ACTIONS.map((act) => <div>{act.icon}</div>)}
  </div>
);

GameMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
    }),
  ),
};

GameMenu.defaultProps = {
  actions: ACTIONS,
};

export default GameMenu;
