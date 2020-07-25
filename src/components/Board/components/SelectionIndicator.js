import React from 'react';
import styled from '@emotion/styled';

import { fillParentElement, SELECTION_COLOR } from 'commonStyles';
import { useSquareContext } from 'contexts/SquareProvider';

const Wrapper = styled.div({
  backgroundColor: SELECTION_COLOR,
  zIndex: '-1',
  ...fillParentElement,
});

const SelectionIndicator = () => {
  const { isSelected } = useSquareContext();
  return isSelected && <Wrapper className="SelectionIndicator" />;
};

export default SelectionIndicator;
