import React, { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Move from './Move';
import { boardPropType } from '../../logic';

// TODO: set max-height by percentage?
// TODO: hide scroll bar?
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 50% auto;
  grid-template-rows: repeat(auto-fill, 50px);
  outline: thin solid #999;
  max-height: 55%;
  overflow: auto;
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
    .map((m, i) => (
      <Move
        key={i}
        idx={i}
        handleMoveSelect={handleMoveSelect}
        fromPos={m.fromPos}
        toPos={m.toPos}
        piece={m.piece}
        selected={selectedIdx === i}
      />
    ));

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
