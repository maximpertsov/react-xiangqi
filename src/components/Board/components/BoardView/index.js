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

const Wrapper = styled.div({
  [MediaQuery.TINY]: {
    gridTemplateRows: `repeat(10, ${SquareSize.TINY})`,
    gridTemplateColumns: `repeat(9, ${SquareSize.TINY})`,
  },
  [MediaQuery.SMALL]: {
    gridTemplateRows: `repeat(10, ${SquareSize.SMALL})`,
    gridTemplateColumns: `repeat(9, ${SquareSize.SMALL})`,
  },
  [MediaQuery.MEDIUM]: {
    gridTemplateRows: `repeat(10, ${SquareSize.MEDIUM})`,
    gridTemplateColumns: `repeat(9, ${SquareSize.MEDIUM})`,
  },
  [MediaQuery.LARGE]: {
    gridTemplateRows: `repeat(10, ${SquareSize.LARGE})`,
    gridTemplateColumns: `repeat(9, ${SquareSize.LARGE})`,
  },
  backgroundColor: '#decfb1',
  backgroundImage: `url(${boardImg})`,
  backgroundPosition: 'top',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  display: 'grid',
  zIndex: 0,
});

const mapStateToProps = createSelector(
  [state => state],

  state => ({
    bottomPlayerIsRed: getBottomPlayerIsRed(state),
    selectedFen: state.selectedFen,
  }),
);

const BoardView = ({ handleSquareClick }) => {
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

  return <Wrapper className="BoardView">{renderSquares()}</Wrapper>;
};

BoardView.propTypes = {
  handleSquareClick: PropTypes.func,
};

BoardView.defaultProps = {
  handleSquareClick: () => {},
};

export default BoardView;
