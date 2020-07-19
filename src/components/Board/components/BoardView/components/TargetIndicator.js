import React from 'react';
import styled from '@emotion/styled';

import { fillParentElement, SELECTION_COLOR } from 'commonStyles';
import PropTypes from 'prop-types';

const TargetOccupiedIndicator = styled.div({
  backgroundColor: SELECTION_COLOR,
  borderRadius: '50%',
  zIndex: '1',
  ...fillParentElement,
});

const TargetEmptyIndicator = styled.div({
  backgroundColor: SELECTION_COLOR,
  borderRadius: '50%',
  height: '50%',
  position: 'relative',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '50%',
});

const TargetIndicator = ({ occupied }) =>
  occupied ? <TargetOccupiedIndicator /> : <TargetEmptyIndicator />;

TargetIndicator.displayName = 'TargetIndicator';

TargetIndicator.propTypes = {
  occupied: PropTypes.bool.isRequired,
};

export default TargetIndicator;
