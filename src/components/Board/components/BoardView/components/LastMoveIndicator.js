import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import styled from '@emotion/styled';
import isEqual from 'lodash/isEqual';

import { fillParentElement } from 'commonStyles';
import { uciToSquares } from 'services/logic/square';

const LAST_MOVE_COLOR = 'rgba(201,255,229,0.8)';

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

const Wrapper = styled.div({
  backgroundColor: LAST_MOVE_COLOR,
  borderRadius: '50%',
  zIndex: '-1',
  ...fillParentElement,
});

const LastMoveIndicator = ({ move, square }) => {
  const { isInLastMove } = useSelector(
    state => mapStateToProps(state, { move, square }),
    isEqual,
  );
  return isInLastMove && <Wrapper className="lastMoveIndicator" />;
};

LastMoveIndicator.propTypes = {
  move: PropTypes.shape(),
  square: PropTypes.string.isRequired,
};

LastMoveIndicator.defaultProps = {
  move: {},
};

export default LastMoveIndicator;
