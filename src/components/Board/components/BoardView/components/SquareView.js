import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// TODO: try this https://stackoverflow.com/questions/18253449/svg-inside-a-scaling-div
const Wrapper = styled.div`
  background-image: url(${props => props.bg});
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  justify-content: center;
  margin: -1px;
  padding: 0px;
  position: relative;
`;

const SquareView = forwardRef(({ bg, children, handleClick }, ref) => (
  <Wrapper className="SquareView" bg={bg} onClick={handleClick} ref={ref}>
    {children}
  </Wrapper>
));

SquareView.propTypes = {
  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default SquareView;
