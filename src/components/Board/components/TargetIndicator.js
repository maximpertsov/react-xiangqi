import React from 'react';
import styled from '@emotion/styled';

import { fillParentElement, SELECTION_COLOR } from 'commonStyles';
import { useSquareContext } from 'contexts/SquareProvider';

const Wrapper = styled.div(props => ({
  backgroundColor: SELECTION_COLOR,
  borderRadius: '50%',
  ...(props.occupied
    ? {
      zIndex: '1',
      ...fillParentElement,
    }
    : {
      height: '50%',
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '50%',
    }),
}));

const TargetIndicator = () => {
  const { isOccupied, isTargeted } = useSquareContext();
  return (
    isTargeted && <Wrapper className="TargetIndicator" occupied={isOccupied} />
  );
};

export default TargetIndicator;
