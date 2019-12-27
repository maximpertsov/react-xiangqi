import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Color } from '../../../../../../services/logic/constants';

const Wrapper = styled.div(
  ({ selected, piece }) => ({
    textDecoration: (selected ? 'underline' : 'none'),
    color: ('RHEAKCP'.includes(piece) ? Color.RED : Color.BLACK),
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
  fromPos, toPos, piece, handleMoveSelect, idx, selected,
}) => {
  if (piece === null) return null;

  const handleClick = () => handleMoveSelect({ idx });

  const description = moveString({ piece, fromPos, toPos });
  return (
    <Wrapper
      className="Move"
      onClick={handleClick}
      selected={selected}
      piece={piece}
    >
      { description }
    </Wrapper>
  );
};

Move.propTypes = {
  handleMoveSelect: PropTypes.func.isRequired,
  fromPos: PropTypes.arrayOf(PropTypes.number),
  toPos: PropTypes.arrayOf(PropTypes.number),
  piece: PropTypes.string,
  idx: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
};

Move.defaultProps = {
  fromPos: null,
  toPos: null,
  piece: null,
};

export default Move;
