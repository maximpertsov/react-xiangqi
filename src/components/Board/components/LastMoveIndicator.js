import React from 'react';
import styled from '@emotion/styled';

import { fillParentElement } from 'commonStyles';
import { useSquareContext } from 'contexts/SquareProvider';

const LAST_MOVE_COLOR = 'rgba(201,255,229,0.8)';

const Wrapper = styled.div({
  backgroundColor: LAST_MOVE_COLOR,
  borderRadius: '50%',
  zIndex: '-1',
  ...fillParentElement,
});

const LastMoveIndicator = () => {
  const { isInLastMove } = useSquareContext();

  return isInLastMove && <Wrapper className="LastMoveIndicator" />;
};

export default LastMoveIndicator;
