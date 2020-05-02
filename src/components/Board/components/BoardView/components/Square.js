import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useDrag } from 'react-dnd';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  opacity: ${props => props.opacity};
  margin: 0px;
  padding: 0px;
  position: relative;
`;

const Square = ({ children, handleClick, isDragging }) => {
  const [{ opacity }, dragRef] = useDrag({
    item: { type: 'SQUARE' },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  return (
    <Wrapper
      className="Square"
      onClick={handleClick}
      opacity={opacity}
      ref={dragRef}
    >
      {children}
    </Wrapper>
  );
};

Square.propTypes = {
  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default Square;
