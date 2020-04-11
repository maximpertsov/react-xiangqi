import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { selectMove } from 'actions';
import { Color } from 'services/logic/constants';

const Wrapper = styled.span(({ isSelected, piece }) => ({
  color: 'RNBAKCP'.includes(piece) ? Color.RED : Color.BLACK,
  padding: '2px',
  textDecoration: isSelected ? 'underline' : 'none',
}));

const P = {
  p: '卒',
  P: '兵',
  r: '車',
  R: '車',
  n: '馬',
  N: '馬',
  b: '象',
  B: '相',
  a: '士',
  A: '仕',
  k: '將',
  K: '帥',
  c: '砲',
  C: '炮',
};

const moveText = ({ piece, move }) => {
  return `${P[piece]}${move}`;
};

const Move = ({ move, moveId, piece }) => {
  const dispatch = useDispatch();
  const isSelected = useSelector(state => state.selectedMoveId === moveId);

  const handleClick = useCallback(() => {
    dispatch(selectMove({ moveId }));
  }, [dispatch, moveId]);

  if (piece === null) return null;

  return (
    <Wrapper
      className="Move"
      onClick={handleClick}
      isSelected={isSelected}
      piece={piece}
    >
      {moveText({ move, piece })}
    </Wrapper>
  );
};

Move.propTypes = {
  move: PropTypes.string,
  moveId: PropTypes.number.isRequired,
  piece: PropTypes.string,
};

Move.defaultProps = {
  move: null,
  piece: null,
};

export default Move;
