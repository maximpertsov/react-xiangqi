import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import { getBottomPlayerIsRed } from 'reducers';
import { MediaQuery, SquareSize } from 'commonStyles';
import { decodeFen } from 'services/logic/fen';
import { encodeSquare } from 'services/logic/square';
import Square from './components/Square';
import boardImg from './assets/board-1000px.svg.png';

const Wrapper = styled.div`
  ${MediaQuery.TINY} {
    grid-template-rows: repeat(10, ${SquareSize.TINY});
    grid-template-columns: repeat(9, ${SquareSize.TINY});
  }
  ${MediaQuery.SMALL} {
    grid-template-rows: repeat(10, ${SquareSize.SMALL});
    grid-template-columns: repeat(9, ${SquareSize.SMALL});
  }
  ${MediaQuery.MEDIUM} {
    grid-template-rows: repeat(10, ${SquareSize.MEDIUM});
    grid-template-columns: repeat(9, ${SquareSize.MEDIUM});
  }
  ${MediaQuery.LARGE} {
    grid-template-rows: repeat(10, ${SquareSize.LARGE});
    grid-template-columns: repeat(9, ${SquareSize.LARGE});
  }
  background-color: #DECFB1;
  background-image: url(${boardImg});
  background-position: top;
  background-repeat: no-repeat;
  background-size: contain;
  display: grid;
  z-index: 0;
`;

const BoardView = ({ handleSquareClick }) => {
  const bottomPlayerIsRed = useSelector(state => getBottomPlayerIsRed(state));
  const selectedFen = useSelector(state => state.selectedFen);

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
  handleSquareClick: PropTypes.func.isRequired,
};

export default BoardView;
