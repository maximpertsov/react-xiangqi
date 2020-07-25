import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import styled from '@emotion/styled';
import isEqual from 'lodash/isEqual';

import { MediaQuery, SquareSize } from 'commonStyles';
import { SquareProvider } from 'contexts/SquareProvider';
import { getSelectedMove } from 'reducers/selectors';
import { decodeFen } from 'services/logic/fen';
import { encodeSquare } from 'services/logic/square';
import SizeProvider from 'SizeProvider';

import boardImg from './assets/board-1000px.svg.png';
import Square from './components/Square';

const gridRowColumnBySizeCSS = squareSize => ({
  gridTemplateRows: `repeat(10, ${squareSize})`,
  gridTemplateColumns: `repeat(9, ${squareSize})`,
});

const MEDIA_QUERY_CSS = {
  [MediaQuery.TINY]: gridRowColumnBySizeCSS(SquareSize.TINY),
  [MediaQuery.SMALL]: gridRowColumnBySizeCSS(SquareSize.SMALL),
  [MediaQuery.MEDIUM]: gridRowColumnBySizeCSS(SquareSize.MEDIUM),
  [MediaQuery.LARGE]: gridRowColumnBySizeCSS(SquareSize.LARGE),
};

const gridRowColumnCSS = ({ size }) => {
  if (size === 'fluid') {
    return MEDIA_QUERY_CSS;
  }
  return gridRowColumnBySizeCSS(SquareSize[size.toUpperCase()]);
};

const Wrapper = styled.div(props => ({
  ...gridRowColumnCSS(props),
  backgroundColor: '#decfb1',
  backgroundImage: `url(${boardImg})`,
  backgroundPosition: 'top',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  display: 'grid',
  zIndex: 0,
}));

const mapStateToProps = createSelector(
  state => getSelectedMove(state),
  (_, props) => props.move,

  (selectedMove, move) => ({
    currentMove: move.fen ? move : selectedMove,
  }),
);

const BoardView = ({ teamBlackPOV, move, size }) => {
  const { currentMove } = useSelector(
    state => mapStateToProps(state, { move }),
    isEqual,
  );

  const getSlot = (slots, i) => (teamBlackPOV ? slots.length - i - 1 : i);

  const renderSquares = () => {
    if (!currentMove.fen) return;

    return decodeFen(currentMove.fen).placement.map((_, i, slots) => {
      const slot = getSlot(slots, i);
      const square = encodeSquare(slot);

      return (
        <SquareProvider key={square} square={square} move={currentMove}>
          <Square key={square} />
        </SquareProvider>
      );
    });
  };

  return (
    <Wrapper className="BoardView" size={size}>
      <SizeProvider size={size}>{renderSquares()}</SizeProvider>
    </Wrapper>
  );
};

BoardView.propTypes = {
  teamBlackPOV: PropTypes.bool,
  move: PropTypes.shape(),
  size: PropTypes.oneOf(['fluid', 'tiny', 'small', 'medium', 'large']),
};

BoardView.defaultProps = {
  teamBlackPOV: false,
  move: {},
  size: 'fluid',
};

export default BoardView;
