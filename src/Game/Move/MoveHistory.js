import React, { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Move from './Move';
import { boardPropType } from '../../logic';

// TODO: set max-height by percentage?
// TODO: hide scroll bar?
// TODO: move colors to constants
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 5px 1fr 1fr 5px 1fr 1fr 5px 1fr 1fr;
  grid-template-rows: repeat(auto-fill, 1fr);
  outline: thin solid #CCC;
  align-items:center;
  color: #999;
  width: 100%;
  min-height: 20px;
  overflow: auto;
  text-align: center;
  font-size: x-small;
`;

const MoveHistory = ({ moves, selectedIdx, handleMoveSelect }) => {
  const [bottomElement, setBottomElement] = useState(undefined);

  useLayoutEffect(
    () => {
      const scrollToBottom = () => {
        try {
          bottomElement.scrollIntoView();
        } catch (e) {
          if (!(e instanceof TypeError)) { throw e; }
        }
      };
      scrollToBottom();
    },
    [bottomElement, moves],
  );

  const moveComponents = moves
    .reduce((acc, m, i) => (
      acc.concat(
        // HACK: counting starts at second element
        i % 2 === 1 ? [`${Math.ceil(i / 2)}.`] : [],
        [
          <Move
            key={i}
            idx={i}
            handleMoveSelect={handleMoveSelect}
            fromPos={m.fromPos}
            toPos={m.toPos}
            piece={m.piece}
            selected={selectedIdx === i}
          />,
        ],
      )),
    [],
    );

  return (
    <Wrapper>
      {moveComponents}
      <div ref={setBottomElement} />
    </Wrapper>
  );
};

MoveHistory.propTypes = {
  // TODO: add move proptype
  moves: PropTypes.arrayOf(boardPropType).isRequired,
  selectedIdx: PropTypes.number.isRequired,
  handleMoveSelect: PropTypes.func.isRequired,
};

export default MoveHistory;
