import React from 'react';
import styled from '@emotion/styled';

import { fillParentElement } from 'commonStyles';
import { useSquareContext } from 'contexts/SquareProvider';

const IN_CHECK_COLOR = 'red';

const Wrapper = styled.div({
  backgroundColor: IN_CHECK_COLOR,
  borderRadius: '50%',
  zIndex: '-1',
  ...fillParentElement,
});

const KingInCheckIndicator = () => {
  const { isKingInCheck } = useSquareContext();

  return isKingInCheck && <Wrapper class="KingInCheckIndicator" />;
};

export default KingInCheckIndicator;
