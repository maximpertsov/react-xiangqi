import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Move from './Move';

// TODO: set max-height by percentage?
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 50% auto;
  grid-template-rows: repeat(auto-fill, 50px);
  outline: thin solid #999;
  height: 55%;
  overflow: auto;
`;

const MoveHistory = ({ moves, selectedMoveIdx, handleMoveSelect }) => {
  const scrollTarget = (<div ref={(el) => { this.el = el; }} />);
  const moveComponents = moves
    .map((m, i) => (
      <Move
        key={i}
        idx={i}
        handleMoveSelect={handleMoveSelect}
        fromPos={m.fromPos}
        toPos={m.toPos}
        piece={m.piece}
        selected={selectedMoveIdx === i}
      />
    ));

  return (
    <Wrapper>
      {moveComponents}
      {scrollTarget}
    </Wrapper>
  );
};

Move.propTypes = {
  // TODO: add move proptype
  moves: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedMoveIdx: PropTypes.number.isRequired,
  handleMoveSelect: PropTypes.func.isRequired,
};

export default MoveHistory;
