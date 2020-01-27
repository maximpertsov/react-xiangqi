import styled from '@emotion/styled';
import { fillParentElement, SELECTION_COLOR } from 'commonStyles';

const SelectionIndicator = styled.div({
  backgroundColor: SELECTION_COLOR,
  zIndex: '-1',
  ...fillParentElement,
});

export default SelectionIndicator;
