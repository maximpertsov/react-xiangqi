import React from 'react';
import styled from '@emotion/styled';

import { fillParentElement } from 'commonStyles';
import { useSquareContext } from 'contexts/SquareProvider';

const dropColor = 'rgba(255, 255, 153, 0.7)';

const Wrapper = styled.div({
  backgroundColor: dropColor,
  borderRadius: '50%',
  zIndex: '1',
  ...fillParentElement,
});

const DropIndicator = () => {
  const { isTargeted } = useSquareContext();

  return isTargeted && <Wrapper className="DropIndicator" />;
};

export default DropIndicator;
