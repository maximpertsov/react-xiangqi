import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { fillParentElement, SELECTION_COLOR } from 'commonStyles';

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

const TargetIndicator = ({ occupied, targeted }) =>
  targeted && <Wrapper className="TargetIndicator" occupied={occupied} />;

TargetIndicator.propTypes = {
  occupied: PropTypes.bool.isRequired,
  targeted: PropTypes.bool.isRequired,
};

export default TargetIndicator;
