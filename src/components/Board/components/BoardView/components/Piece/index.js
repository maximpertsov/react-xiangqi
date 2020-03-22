import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

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
  pointer-events: none;
  user-select: none;
  -moz-user-select: none;
  max-height: 80%;
  max-width: 80%;
  display: block;
  margin: auto;
  z-index: ${props => (isMoving(props) ? 100 : 0)};
  transition: transform 50ms ease-in-out;
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
`;

const Piece = ({ code, moveX, moveY }) => (
  <Wrapper
    alt=""
    className="Piece"
    moveX={moveX}
    moveY={moveY}
    src={getImageByCode(code)}
  />
);

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
