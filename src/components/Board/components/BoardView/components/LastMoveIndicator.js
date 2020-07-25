import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from '@emotion/styled';
import isEqual from 'lodash/isEqual';

import { fillParentElement } from 'commonStyles';
import { SquareContext } from 'contexts/SquareProvider';
import { uciToSquares } from 'services/logic/square';

const getIsInLastMove = ({ move, square }) => {
  if (!move.uci) return false;

  return uciToSquares(move.uci).includes(square);
};

const mapStateToProps = createSelector(
  (_, props) => props.square,
  (_, props) => props.move,

  (square, move) => ({
    isInLastMove: getIsInLastMove({ move, square }),
  }),
);

const LAST_MOVE_COLOR = 'rgba(201,255,229,0.8)';

const Wrapper = styled.div({
  backgroundColor: LAST_MOVE_COLOR,
  borderRadius: '50%',
  zIndex: '-1',
  ...fillParentElement,
});

const LastMoveIndicator = () => {
  const { move, square } = useContext(SquareContext);

  const { isInLastMove } = useSelector(
    state => mapStateToProps(state, { move, square }),
    isEqual,
  );
  return isInLastMove && <Wrapper className="lastMoveIndicator" />;
};

export default LastMoveIndicator;
