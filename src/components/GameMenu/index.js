/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Children } from 'react';
import PropTypes from 'prop-types';

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
