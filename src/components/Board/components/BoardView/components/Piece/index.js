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

  return { transform: `translate(${xTranslate}, ${yTranslate})` };
};

const mediaQueryCSS = props => ({
  [MediaQuery.TINY]: transformBySizeCSS(SquareSize.TINY, props),
  [MediaQuery.SMALL]: transformBySizeCSS(SquareSize.SMALL, props),
  [MediaQuery.MEDIUM]: transformBySizeCSS(SquareSize.MEDIUM, props),
  [MediaQuery.LARGE]: transformBySizeCSS(SquareSize.LARGE, props),
});

const transformCSS = props => {
  const { size } = props;

  if (size === 'fluid') {
    return mediaQueryCSS(props);
  }
  return transformBySizeCSS(SquareSize[size.toUpperCase()]);
};

const Wrapper = styled.img(props => ({
  ...transformCSS(props),
  WebkitUserSelect: 'none',
  KhtmlUserSelect: 'none',
  MozUserSelect: 'none',
  OUserSelect: 'none',
  display: 'block',
  margin: 'auto',
  maxHeight: '80%',
  maxWidth: '80%',
  opacity: props => props.opacity,
  transition: 'transform 50ms ease-in-out',
  userSelect: 'none',
  zIndex: isMoving(props) ? 100 : 0,
}));

const Piece = ({ code, moveX, moveY, size, square }) => {
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
      size={size}
      src={getImageByCode(code)}
    />
  );
};

Piece.propTypes = {
  code: PropTypes.oneOf(ALL_PIECES).isRequired,
  moveX: PropTypes.number,
  moveY: PropTypes.number,
  size: PropTypes.oneOf(['fluid', 'tiny', 'small', 'medium', 'large']),
  square: PropTypes.string.isRequired,
};

Piece.defaultProps = {
  moveX: 0,
  moveY: 0,
  size: 'fluid',
};

export default Piece;
