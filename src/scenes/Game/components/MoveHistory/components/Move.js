import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { decode as decodeFen } from 'services/logic/fen';
import { getMovedPiece } from 'services/logic/move';
import { getSelectedMove } from 'reducers';
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

const Move = ({ fen, move, moveId }) => {
  const dispatch = useDispatch();
  const selectedMove = useSelector(state => getSelectedMove(state));

  const handleClick = useCallback(() => {
    dispatch(selectMove({ moveId }));
  }, [dispatch, moveId]);

  if (move === null) return null;

  const piece = getMovedPiece(decodeFen(fen).placement, move);

  return (
    <Wrapper
      className="Move"
      onClick={handleClick}
      isSelected={selectedMove.id === moveId}
      piece={piece}
    >
      {moveText({ move, piece })}
    </Wrapper>
  );
};

Move.propTypes = {
  fen: PropTypes.string.isRequired,
  move: PropTypes.string,
  moveId: PropTypes.number.isRequired,
};

Move.defaultProps = {
  move: null,
};

export default Move;
