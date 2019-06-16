import React from 'react';
import PropTypes from 'prop-types';

const Move = ({ description }) => (
  <div>
    <p>{ description }</p>
  </div>
);

Move.propTypes = {
  description: PropTypes.string.isRequired,
};

export default Move;
