import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled.div(
  {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    display: 'flex',
    justifyContent: 'center',
  },
  ({ selected }) => ({
    backgroundColor: (selected ? 'rgba(152, 251, 152, 0.3)' : 'none'),
  }),
);

class Square extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      selected: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { slot, selectedSlot } = nextProps;

    if (this.isOccupied() && slot === selectedSlot) {
      this.setState((prevState) => ({ selected: !prevState.selected }));
    } else {
      this.setState({ selected: false });
    }
  }

  getPiece() {
    if (!this.isOccupied()) return (<div />);
    const { piece } = this.props;
    return piece;
  }

  handleClick() {
    const {
      slot, selectedSlot, handleMove, handleSelect,
    } = this.props;
    const { selected } = this.state;
    if (this.isOccupied() && selected) handleSelect(null);
    else if (this.isOccupied()) handleSelect(selected);
    else if (this.anySelected()) handleMove(selectedSlot, slot);
    else handleSelect(null);
  }

  isOccupied() {
    const { piece } = this.props;
    return piece !== undefined;
  }

  anySelected() {
    const { selectedSlot } = this.props;
    return selectedSlot !== null;
  }

  render() {
    const { selected } = this.state;

    return (
      <Wrapper
        className="Square"
        onClick={this.handleClick}
        selected={selected}
      >
        {this.getPiece()}
      </Wrapper>
    );
  }
}

Square.propTypes = {
  handleMove: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  piece: PropTypes.element,
  slot: PropTypes.number.isRequired,
  selectedSlot: PropTypes.number,
};

Square.defaultProps = {
  piece: undefined,
  selectedSlot: null,
};

export default Square;
