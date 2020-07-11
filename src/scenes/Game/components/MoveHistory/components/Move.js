import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import isEqual from 'lodash/isEqual';

import actions from 'actions';
import { decodeFen } from 'services/logic/fen';
import { getMovedPiece } from 'services/logic/move';
import { getSelectedMove } from 'reducers';
import { Team } from 'services/logic/constants';

const Wrapper = styled.span(({ isSelected, piece }) => ({
  color: 'RNBAKCP'.includes(piece) ? Team.RED : Team.BLACK,
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

const moveText = ({ uci, piece }) => {
  return `${P[piece]}${uci}`;
};

const Move = ({ uci, fen }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const selectedMove = useSelector(state => getSelectedMove(state), isEqual);

  const handleClick = useCallback(() => {
    dispatch(actions.game.selectedFen.set(fen));
  }, [dispatch, fen]);

  useEffect(() => {
    if (selectedMove.fen === fen) {
      if (!ref.current) return;

      ref.current.scrollIntoViewIfNeeded();
    }
  }, [fen, selectedMove.fen]);

  if (uci === null) return null;

  const piece = getMovedPiece(decodeFen(fen).placement, uci);

  return (
    <Wrapper
      className="Move"
      onClick={handleClick}
      isSelected={selectedMove.fen === fen}
      ref={ref}
      piece={piece}
    >
      {moveText({ uci, piece })}
    </Wrapper>
  );
};

Move.propTypes = {
  fen: PropTypes.string.isRequired,
  uci: PropTypes.string,
};

Move.defaultProps = {
  uci: null,
};

export default Move;
