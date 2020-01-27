import styled from '@emotion/styled';
import { fillParentElement } from 'commonStyles';

const IN_CHECK_COLOR = 'red';

const KingInCheckIndicator = styled.div({
  backgroundColor: IN_CHECK_COLOR,
  borderRadius: '50%',
  zIndex: '-1',
  ...fillParentElement,
});

export default KingInCheckIndicator;
