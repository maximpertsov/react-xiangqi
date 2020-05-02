import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';

import { ALL_PIECES } from 'services/logic/constants';
import { MediaQuery, SquareSize } from 'commonStyles';
import getImageByCode from './images';

const isMoving = ({ moveX, moveY }) => moveX !== 0 || moveY !== 0;

const cssTransform = (squareSize, { moveX, moveY }) => {
  const xTranslate = `calc(${squareSize} * ${moveX})`;
  const yTranslate = `calc(${squareSize} * ${moveY})`;

  return `transform: translate(${xTranslate}, ${yTranslate})`;
};

const Wrapper = styled.img`
  ${MediaQuery.TINY} {
    ${props => cssTransform(SquareSize.TINY, props)};
  }
  ${MediaQuery.SMALL} {
    ${props => cssTransform(SquareSize.SMALL, props)};
  }
  ${MediaQuery.MEDIUM} {
    ${props => cssTransform(SquareSize.MEDIUM, props)};
  }
  ${MediaQuery.LARGE} {
    ${props => cssTransform(SquareSize.LARGE, props)};
  }
  -moz-user-select: none;
  display: block;
  margin: auto;
  max-height: 80%;
  max-width: 80%;
  opacity: ${props => props.opacity};
  transition: transform 50ms ease-in-out;
  user-select: none;
  z-index: ${props => (isMoving(props) ? 100 : 0)};
`;

const Piece = ({ code, moveX, moveY }) => {
  const [{ opacity }, dragRef] = useDrag({
    item: { type: 'PIECE' },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  return (
    <Wrapper
      alt=""
      className={`Piece ${code}`}
      moveX={moveX}
      moveY={moveY}
      opacity={opacity}
      ref={dragRef}
      src={getImageByCode(code)}
    />
  );
};

Piece.propTypes = {
  code: PropTypes.oneOf(ALL_PIECES).isRequired,
  moveX: PropTypes.number,
  moveY: PropTypes.number,
};

Piece.defaultProps = {
  moveX: 0,
  moveY: 0,
};

export default Piece;
