import React, { forwardRef } from 'react';
import styled from '@emotion/styled';

import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0px;
  padding: 0px;
  position: relative;
`;

const SquareView = forwardRef(({ children, handleClick }, ref) => (
  <Wrapper className="SquareView" onClick={handleClick} ref={ref}>
    {children}
  </Wrapper>
));

SquareView.propTypes = {
  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default SquareView;
