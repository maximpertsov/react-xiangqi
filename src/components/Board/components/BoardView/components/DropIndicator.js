import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { fillParentElement } from 'commonStyles';

const dropColor = 'rgba(255, 255, 153, 0.7)';

const Wrapper = styled.div({
  backgroundColor: dropColor,
  borderRadius: '50%',
  zIndex: '1',
  ...fillParentElement,
});

const DropIndicator = ({ over, targeted }) => {
  return over && targeted && <Wrapper className="DropIndicator" />;
};

DropIndicator.propTypes = {
  over: PropTypes.bool.isRequired,
  targeted: PropTypes.bool.isRequired,
};

export default DropIndicator;
