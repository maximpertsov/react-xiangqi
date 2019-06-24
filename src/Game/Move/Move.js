import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled.div(
  ({ selected }) => ({
    backgroundColor: (selected ? 'grey' : 'none'),
  }),
);

const Move = ({
  fromPos, toPos, piece, handleMoveSelect, order, selected,
}) => {
  if (piece === null) return null;

  const description = `${piece}: ${fromPos} -> ${toPos}`;
  return (
    <Wrapper
      className="Move"
      onClick={(e) => handleMoveSelect(e, order)}
      selected={selected}
    >
      <p>{ description }</p>
    </Wrapper>
  );
};

Move.propTypes = {
  handleMoveSelect: PropTypes.func.isRequired,
  fromPos: PropTypes.arrayOf(PropTypes.number).isRequired,
  toPos: PropTypes.arrayOf(PropTypes.number).isRequired,
  piece: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default Move;
