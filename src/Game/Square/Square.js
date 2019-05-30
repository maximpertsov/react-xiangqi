import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const SELECTION_GREEN = 'rgba(152, 251, 152, 0.3)';

const Wrapper = styled.div(
  {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    display: 'flex',
    justifyContent: 'center',
    padding: '0px;',
    margin: '0px;',
  },
  ({ selected, targeted }) => ({
    backgroundColor: (selected ? SELECTION_GREEN : 'none'),
    outline: (targeted ? `3px dotted ${SELECTION_GREEN}` : 'none'),
    outlineOffset: (targeted ? '-2px' : 'none'),
  }),
);

const Dot = styled.div`
  width:50%;
  height:50%;
  position:relative;
  top:50%;
  transform:translateY(-50%);
  border-radius:50%;
  background:${SELECTION_GREEN};
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

  renderSquareElement() {
    const { slot, piece, targets } = this.props;
    if (this.isOccupied()) return piece;
    if (targets.includes(slot)) return (<Dot />);
    return (<div />);
  }

  render() {
    const { selected } = this.state;
    const { slot, targets } = this.props;
    const targeted = (this.isOccupied() && targets.includes(slot));

    return (
      <Wrapper
        className="Square"
        onClick={this.handleClick}
        selected={selected}
        targeted={targeted}
      >
        {this.renderSquareElement()}
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
