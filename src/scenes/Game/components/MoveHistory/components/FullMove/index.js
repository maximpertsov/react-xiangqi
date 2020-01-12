import React from 'react';
import PropTypes from 'prop-types';

const FullMove = ({ children, ordering }) =>
  (
    <div>
      <span>{`${ordering}. `}</span>
      {children}
    </div>
  );

FullMove.propTypes = {
  children: PropTypes.node.isRequired,
  ordering: PropTypes.number.isRequired,
};

export default FullMove;
