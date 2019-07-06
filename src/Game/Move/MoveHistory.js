import React, { Component } from 'react';
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
  height: 55%;
  overflow: auto;
`;

class MoveHistory extends Component {
  constructor(props) {
    super(props);
    this.setBottomElement = this.setBottomElement.bind(this);
  }

  componentDidMount() {
    if (this.el !== undefined) this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView();
  }

  setBottomElement(el) {
    this.el = el;
  }

  render() {
    const { moves, selectedIdx, handleMoveSelect } = this.props;
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
        <div ref={this.setBottomElement} />
      </Wrapper>
    );
  }
}

MoveHistory.propTypes = {
  // TODO: add move proptype
  moves: PropTypes.arrayOf(boardPropType).isRequired,
  selectedIdx: PropTypes.number.isRequired,
  handleMoveSelect: PropTypes.func.isRequired,
};

export default MoveHistory;
