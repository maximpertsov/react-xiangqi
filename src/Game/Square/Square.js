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

const Dot = styled.div`
  width:50%;
  height:50%;
  color:#fff;
  position:relative;
  top:50%;
  transform:translateY(-50%);
  border-radius:50%;
  background:rgba(152, 251, 152, 0.3);
`;

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
    const { slot, piece, targets } = this.props;

    if (this.isOccupied()) return piece;
    if (targets.includes(slot)) return (<Dot />);
    return (<div />);
  }

  handleClick() {
    const { handleSquareClick } = this.props;
    handleSquareClick(this);
  }

  isOccupied() {
    const { piece } = this.props;
    return piece !== undefined;
  }

  isSelected() {
    const { selected } = this.state;
    return selected;
  }

  clickWillUnselect() {
    return this.isOccupied() && this.isSelected();
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
  handleSquareClick: PropTypes.func.isRequired,
  piece: PropTypes.element,
  slot: PropTypes.number.isRequired,
  selectedSlot: PropTypes.number,
  targets: PropTypes.arrayOf(PropTypes.number).isRequired,
};

Square.defaultProps = {
  piece: undefined,
  selectedSlot: null,
};

export default Square;
