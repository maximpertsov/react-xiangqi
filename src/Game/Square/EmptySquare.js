/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';

const SELECTION_GREEN = 'rgba(30, 179, 0, 0.3)';

const EmptySquare = ({ handleClick, targeted }) => {
  if (targeted) {
    return (
      <div
        onClick={handleClick}
        css={css`
          width:50%;
          height:50%;
          position:relative;
          top:50%;
          transform:translateY(-50%);
          border-radius:50%;
          background:${SELECTION_GREEN};
        `}
      />
    );
  }
  return <div />;
};

EmptySquare.propTypes = {
  handleClick: PropTypes.func.isRequired,
  targeted: PropTypes.bool.isRequired,
};

export default EmptySquare;
