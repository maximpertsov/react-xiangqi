import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import SizeProvider from 'SizeProvider';
import { getSelectedMove } from 'reducers/selectors';
import { MediaQuery, SquareSize } from 'commonStyles';
import { decodeFen } from 'services/logic/fen';
import { encodeSquare } from 'services/logic/square';
import Square from './components/Square';
import boardImg from './assets/board-1000px.svg.png';

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

const BoardView = ({ teamBlackPOV, handleSquareClick, move, size }) => {
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
        <Square
          key={square}
          handleSquareClick={handleSquareClick}
          square={square}
          move={currentMove}
        />
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
  handleSquareClick: PropTypes.func,
  move: PropTypes.shape(),
  size: PropTypes.oneOf(['fluid', 'tiny', 'small', 'medium', 'large']),
};

BoardView.defaultProps = {
  teamBlackPOV: false,
  handleSquareClick: () => {},
  move: {},
  size: 'fluid',
};

export default BoardView;
