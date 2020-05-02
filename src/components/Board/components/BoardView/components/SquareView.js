import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// background-color: ${props => props.isOver ? 'rgba(255, 255, 153, 0.7)' : 'none'};
// border-radius: 50%;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0px;
  padding: 0px;
  position: relative;
`;

const SquareView = ({ children, handleClick }) => (
  <Wrapper className="SquareView" onClick={handleClick}>
    {children}
  </Wrapper>
);

SquareView.propTypes = {
  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default SquareView;
