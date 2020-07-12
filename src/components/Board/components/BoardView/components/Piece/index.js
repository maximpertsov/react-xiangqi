import React from 'react';
import { useDispatch } from 'react-redux';

import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import actions from 'actions';

import { ALL_PIECES } from 'services/logic/constants';
import { MediaQuery, SquareSize } from 'commonStyles';
import getImageByCode from './images';

const isMoving = ({ moveX, moveY }) => moveX !== 0 || moveY !== 0;

const transformBySizeCSS = (squareSize, { moveX, moveY }) => {
  const xTranslate = `calc(${squareSize} * ${moveX})`;
  const yTranslate = `calc(${squareSize} * ${moveY})`;

  return `transform: translate(${xTranslate}, ${yTranslate})`;
};

// const MEDIA_QUERY_CSS = {
//   [MediaQuery.TINY]: transformBySizeCSS(SquareSize.TINY),
//   [MediaQuery.SMALL]: transformBySizeCSS(SquareSize.SMALL),
//   [MediaQuery.MEDIUM]: transformBySizeCSS(SquareSize.MEDIUM),
//   [MediaQuery.LARGE]: transformBySizeCSS(SquareSize.LARGE),
// };

// const transformCSS = ({ size }) => {
//   if (size === 'fluid') {
//     return MEDIA_QUERY_CSS;
//   }
//   return transformBySizeCSS(SquareSize[size.toUpperCase()]);
// };

const Wrapper = styled.img`
  ${MediaQuery.TINY} {
    ${props => transformBySizeCSS(SquareSize.TINY, props)};
  }
  ${MediaQuery.SMALL} {
    ${props => transformBySizeCSS(SquareSize.SMALL, props)};
  }
  ${MediaQuery.MEDIUM} {
    ${props => transformBySizeCSS(SquareSize.MEDIUM, props)};
  }
  ${MediaQuery.LARGE} {
    ${props => transformBySizeCSS(SquareSize.LARGE, props)};
  }
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  display: block;
  margin: auto;
  max-height: 80%;
  max-width: 80%;
  opacity: ${props => props.opacity};
  transition: transform 50ms ease-in-out;
  user-select: none;
  z-index: ${props => (isMoving(props) ? 100 : 0)};
`;

const Piece = ({ code, moveX, moveY, square }) => {
  const dispatch = useDispatch();

  const [{ opacity }, dragRef] = useDrag({
    item: { type: 'PIECE' },
    begin: () => dispatch(actions.board.selectedSquare.set(square)),
    end: () => dispatch(actions.board.selectedSquare.set(null)),
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.3 : 1,
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
  square: PropTypes.string.isRequired,
};

Piece.defaultProps = {
  moveX: 0,
  moveY: 0,
};

export default Piece;
