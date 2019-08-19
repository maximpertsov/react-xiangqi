/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

const GameMenu = ({ action }) => (
  <div
    className="GameMenu"
    css={css`
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        text-align: center;
        align-items: center;
    `}
  >
    <div>⋮</div>
    <div>↩️</div>
    <div>🔃</div>
    <div>⏪</div>
    <div>⏩</div>
  </div>
);

GameMenu.propTypes = {
  action: PropTypes.func.isRequired,
};

export default GameMenu;
