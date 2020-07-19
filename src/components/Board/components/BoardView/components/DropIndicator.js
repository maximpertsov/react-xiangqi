import styled from '@emotion/styled';

import { fillParentElement } from 'commonStyles';

const dropColor = 'rgba(255, 255, 153, 0.7)';

const DropIndicator = styled.div({
  backgroundColor: dropColor,
  borderRadius: '50%',
  zIndex: '1',
  ...fillParentElement,
});

DropIndicator.displayName = 'DropIndicator';

export default DropIndicator;
