import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from '@emotion/styled';
import isEqual from 'lodash/isEqual';

import { fillParentElement, SELECTION_COLOR } from 'commonStyles';
import { SquareContext } from 'contexts/SquareProvider';
import { getIsMoving } from 'reducers';

const getIsSelected = ({ isMoving, selectedSquare, square }) => {
  if (isMoving) return false;

  return selectedSquare === square;
};

const mapStateToProps = createSelector(
  state => getIsMoving(state),
  state => state.selectedSquare,
  (_, props) => props.square,

  (isMoving, selectedSquare, square) => ({
    isSelected: getIsSelected({ isMoving, selectedSquare, square }),
  }),
);

const Wrapper = styled.div({
  backgroundColor: SELECTION_COLOR,
  zIndex: '-1',
  ...fillParentElement,
});

const SelectionIndicator = () => {
  const { square } = useContext(SquareContext);
  const { isSelected } = useSelector(
    state => mapStateToProps(state, { square }),
    isEqual,
  );
  return isSelected && <Wrapper className="SelectionIndicator" />;
};

export default SelectionIndicator;
