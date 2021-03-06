import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';

import actions from 'actions';
import { MediaQuery, SquareSize } from 'commonStyles';
import { useSquareContext } from 'contexts/SquareProvider';
import { SizeContext } from 'SizeProvider';

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
  return transformBySizeCSS(SquareSize[size.toUpperCase()], props);
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

const Piece = () => {
  const dispatch = useDispatch();
  const size = useContext(SizeContext);
  const { isOccupied, moveX, moveY, pieceCode, square } = useSquareContext();

  const [{ opacity }, dragRef] = useDrag({
    item: { type: 'PIECE' },
    begin: () => dispatch(actions.board.selectedSquare.set(square)),
    end: () => dispatch(actions.board.selectedSquare.set(null)),
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.3 : 1,
    }),
  });

  return (
    isOccupied && (
      <Wrapper
        alt=""
        className={`Piece ${pieceCode}`}
        moveX={moveX}
        moveY={moveY}
        opacity={opacity}
        ref={dragRef}
        size={size}
        src={getImageByCode(pieceCode)}
      />
    )
  );
};

export default Piece;
