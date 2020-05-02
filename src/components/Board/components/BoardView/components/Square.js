import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { useDrop } from 'react-dnd';

const Wrapper = styled.div`
  background-color: ${props =>
    props.isOver ? 'rgba(255, 255, 153, 0.7)' : 'none'};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  margin: 0px;
  padding: 0px;
  position: relative;
`;

const Square = ({ children, handleClick }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'PIECE',
    drop: () => true,
    canDrop: () => true,
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <Wrapper
      className="Square"
      ref={drop}
      onClick={handleClick}
      isOver={isOver}
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
