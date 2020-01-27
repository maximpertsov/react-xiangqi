import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import XiangqiPiece from './components/Piece';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0px;
  padding: 0px;
  position: relative;
`;

const Square = ({ children, handleClick, pieceCode, selected }) => {
  const [moveX, moveY] = useSelector(state => state.animationOffset);
  const occupied = pieceCode !== undefined;

  const selectedMoveX = selected ? moveX : 0;
  const selectedMoveY = selected ? moveY : 0;

  /* eslint-disable jsx-a11y/no-static-element-interactions */
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  return (
    <Wrapper className="Square" onClick={handleClick}>
      {children}
      {occupied && (
        <XiangqiPiece
          moveX={selectedMoveX}
          moveY={selectedMoveY}
          code={pieceCode}
        />
      )}
    </Wrapper>
  );
  /* eslint-enable jsx-a11y/no-static-element-interactions */
  /* eslint-enable jsx-a11y/click-events-have-key-events */
};

Square.propTypes = {
  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
  pieceCode: PropTypes.string,
  selected: PropTypes.bool.isRequired,
};

Square.defaultProps = {
  pieceCode: undefined,
};

export default Square;
