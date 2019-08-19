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

const CONFIRM_ACTIONS = [
  { icon: 'Confirm move?' },
  { icon: '✅' },
  { icon: '❌' },
];

const DEFAULT_CALLBACK = () => { console.log('Undefined'); };

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
    { actions.map((act, i) => (
      <div
        key={i}
        onClick={act.callback || DEFAULT_CALLBACK}
      >
        {act.icon}
      </div>
    ))}
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
  actions: CONFIRM_ACTIONS,
};

export default GameMenu;
