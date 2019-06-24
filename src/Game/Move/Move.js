import React from 'react';
import PropTypes from 'prop-types';

const Move = ({ fromPos, toPos, piece }) => {
  // const [fromRank, fromFile] = fromPos;
  // const [fromRank, fromFile] = toPos;
  const description = `${piece}: ${fromPos} -> ${toPos}`;
  return (
    <div>
      <p>{ description }</p>
    </div>
  );
};

Move.propTypes = {
  fromPos: PropTypes.arrayOf(PropTypes.number).isRequired,
  toPos: PropTypes.arrayOf(PropTypes.number).isRequired,
  piece: PropTypes.string.isRequired,
};

export default Move;
