/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Children } from 'react';
import PropTypes from 'prop-types';

// const DEFAULT_ACTIONS = [
//   { text: '\u22EE' },
//   { text: '\u21A9' },
//   { text: '\ud83d\udd03' },
//   { text: '\u23EA' },
//   { text: '\u23E9' },
// ];

const GameMenu = ({ children }) => (
  <div
    className="GameMenu"
    css={css`
        display: grid;
        grid-template-columns: repeat(${Children.count(children)}, 1fr);
        text-align: center;
        align-items: center;
    `}
  >
    {children}
  </div>
);

GameMenu.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GameMenu;
