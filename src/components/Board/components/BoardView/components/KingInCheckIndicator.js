import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from '@emotion/styled';
import isEqual from 'lodash/isEqual';

import { fillParentElement } from 'commonStyles';
import { SquareContext } from 'contexts/SquareProvider';
import { activeKing } from 'services/logic/fen';

const getIsKingInCheck = ({ move, square }) => {
  if (!move.givesCheck) return false;

  return activeKing(move.fen) === square;
};

const mapStateToProps = createSelector(
  (_, props) => props.square,
  (_, props) => props.move,

  (square, move) => ({
    isKingInCheck: getIsKingInCheck({ move, square }),
  }),
);

const IN_CHECK_COLOR = 'red';

const Wrapper = styled.div({
  backgroundColor: IN_CHECK_COLOR,
  borderRadius: '50%',
  zIndex: '-1',
  ...fillParentElement,
});

const KingInCheckIndicator = () => {
  const { move, square } = useContext(SquareContext);

  const { isKingInCheck } = useSelector(
    state => mapStateToProps(state, { move, square }),
    isEqual,
  );

  return isKingInCheck && <Wrapper class="kingInCheckIndicator" />;
};

export default KingInCheckIndicator;
