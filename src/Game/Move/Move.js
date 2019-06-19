import React from 'react';
import PropTypes from 'prop-types';

const Move = ({ fromPos, toPos }) => {
  const description = `${fromPos} -> ${toPos}`;
  return (
    <div>
      <p>{ description }</p>
    </div>
  );
};

Move.propTypes = {
  fromPos: PropTypes.string.isRequired,
  toPos: PropTypes.string.isRequired,
};

export default Move;
