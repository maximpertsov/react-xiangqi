/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const DEFAULT_ACTIONS = [
  { text: '\u22EE' },
  { text: '\u21A9' },
  { text: '\ud83d\udd03' },
  { text: '\u23EA' },
  { text: '\u23E9' },
];

const DEFAULT_CALLBACK = () => {};

const GameMenu = ({ actions }) => (
  <div
    className="GameMenu"
    css={css`
        display: grid;
        font-size: small;
        grid-template-columns: repeat(${actions.length}, 1fr);
        text-align: center;
        align-items: center;
    `}
  >
    { actions.map((act) => (
      <Button
        onClick={act.callback || DEFAULT_CALLBACK}
      >
        {act.text}
      </Button>
    ))}
  </div>
);

GameMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
    }),
  ),
};

GameMenu.defaultProps = {
  actions: DEFAULT_ACTIONS,
};

export default GameMenu;
