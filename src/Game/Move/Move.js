import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled.div(
  ({ selected, piece }) => ({
    // TODO: find a better selction color
    backgroundColor: (selected ? '#abc999' : 'none'),
    color: ('RHEAKCP'.includes(piece) ? 'red' : 'black'),
  }),
);

// TODO: remove temporary lookups in favor of something better?
const F = 'abcdefghi';
const R = Array(10).fill().map((x, i) => i + 1).reverse();
const P = {
  p: '卒',
  P: '兵',
  r: '車',
  R: '車',
  h: '馬',
  H: '馬',
  e: '象',
  E: '相',
  a: '士',
  A: '仕',
  k: '將',
  K: '帥',
  c: '砲',
  C: '炮',
};

const moveString = ({ piece, fromPos, toPos }) => {
  const [fromRank, fromFile] = fromPos;
  const [toRank, toFile] = toPos;
  return `${P[piece]}${F[fromFile]}${R[fromRank]}-${F[toFile]}${R[toRank]}`;
};

const Move = ({
  fromPos, toPos, piece, handleMoveSelect, order, selected,
}) => {
  if (piece === null) return null;

  const description = moveString({ piece, fromPos, toPos });
  return (
    <Wrapper
      className="Move"
      onClick={(e) => handleMoveSelect(e, order)}
      selected={selected}
      piece={piece}
    >
      <p>{ description }</p>
    </Wrapper>
  );
};

// TODO: allow fromPos, toPos, piece to be null
Move.propTypes = {
  handleMoveSelect: PropTypes.func.isRequired,
  fromPos: PropTypes.arrayOf(PropTypes.number).isRequired,
  toPos: PropTypes.arrayOf(PropTypes.number).isRequired,
  piece: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default Move;
