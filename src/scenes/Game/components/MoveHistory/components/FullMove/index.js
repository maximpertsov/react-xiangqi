import React from 'react';
import PropTypes from 'prop-types';

const FullMove = ({ ordering, redMove, blackMove }) =>
  (
    <div>
      <span>{`${ordering}. `}</span>
      {redMove}
      {blackMove}
    </div>
  );

// TODO: proptypes
FullMove.propTypes = {
  blackMove: PropTypes.element,
  redMove: PropTypes.element.isRequired,
  ordering: PropTypes.number.isRequired,
};

FullMove.defaultProps = {
  blackMove: undefined,
};

export default FullMove;
