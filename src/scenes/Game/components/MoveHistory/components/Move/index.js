import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { selectMove } from 'actions';
import { Color } from 'services/logic/constants';
import { getRankFile } from 'services/logic/utils';

const Wrapper = styled.span(
  ({ isSelected, piece }) => ({
    color: ('RHEAKCP'.includes(piece) ? Color.RED : Color.BLACK),
    padding: '2px',
    textDecoration: (isSelected ? 'underline' : 'none'),
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

const moveText = ({ piece, fromSlot, toSlot }) => {
  const [fromRank, fromFile] = getRankFile(fromSlot);
  const [toRank, toFile] = getRankFile(toSlot);
  return `${P[piece]}${F[fromFile]}${R[fromRank]}-${F[toFile]}${R[toRank]}`;
};

const Move = ({ fromSlot, toSlot, piece, moveId }) => {
  const dispatch = useDispatch();
  const isSelected = useSelector(state => state.selectedMoveId === moveId);

  const handleClick = useCallback(
    () => { dispatch(selectMove({ moveId })); },
    [dispatch, moveId]
  );

  if (piece === null) return null;

  return (
    <Wrapper
      className="Move"
      onClick={handleClick}
      isSelected={isSelected}
      piece={piece}
    >
      { moveText({ piece, fromSlot, toSlot }) }
    </Wrapper>
  );
};

Move.propTypes = {
  fromSlot: PropTypes.number.isRequired,
  toSlot: PropTypes.number.isRequired,
  piece: PropTypes.string.isRequired,
  moveId: PropTypes.number.isRequired,
};

export default Move;
