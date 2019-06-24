import React from 'react';
import PropTypes from 'prop-types';

const Move = ({ fromPos, toPos, piece }) => {
  const description = `${piece}: ${fromPos} -> ${toPos}`;
  return (
    <div>
      <p>{ description }</p>
    </div>
  );
};

Move.propTypes = {
  fromPos: PropTypes.string.isRequired,
  toPos: PropTypes.string.isRequired,
  piece: PropTypes.string.isRequired,
};

export default Move;
