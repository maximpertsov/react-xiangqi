import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import { getBottomPlayerIsRed } from 'reducers';
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

  return gridRowColumnBySizeCSS(Square[size]);
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
  [state => state],

  state => ({
    bottomPlayerIsRed: getBottomPlayerIsRed(state),
    selectedFen: state.selectedFen,
  }),
);

const BoardView = ({ handleSquareClick, size }) => {
  const { bottomPlayerIsRed, selectedFen } = useSelector(
    mapStateToProps,
    isEqual,
  );

  const getSlot = useCallback(
    (slots, i) => (bottomPlayerIsRed ? i : slots.length - i - 1),
    [bottomPlayerIsRed],
  );

  const renderSquares = useCallback(() => {
    if (!selectedFen) return;

    return decodeFen(selectedFen).placement.map((_, i, slots) => {
      const slot = getSlot(slots, i);
      const square = encodeSquare(slot);

      return (
        <Square
          key={square}
          handleSquareClick={handleSquareClick}
          square={square}
        />
      );
    });
  }, [getSlot, handleSquareClick, selectedFen]);

  return (
    <Wrapper className="BoardView" size={size}>
      {renderSquares()}
    </Wrapper>
  );
};

BoardView.propTypes = {
  handleSquareClick: PropTypes.func,
  size: PropTypes.oneOf(['fluid', 'tiny', 'small', 'medium', 'large']),
};

BoardView.defaultProps = {
  handleSquareClick: () => {},
  size: 'fluid',
};

export default BoardView;
