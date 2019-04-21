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
    const {
      piece, row, col, selectedRow, selectedCol,
    } = nextProps;

    if (piece !== undefined && row === selectedRow && col === selectedCol) {
      this.setState((prevState) => ({ selected: !prevState.selected }));
    } else {
      this.setState({ selected: false });
    }
  }

  handleClick() {
    const {
      piece, row, col, handleSelect,
    } = this.props;
    if (piece !== undefined) {
      handleSelect(row, col);
    } else {
      handleSelect(null, null);
    }
  }

  render() {
    const { piece } = this.props;
    const { selected } = this.state;

    return (
      <Wrapper
        className="Square"
        onClick={this.handleClick}
        selected={selected}
      >
        {piece}
      </Wrapper>
    );
  }
}

Square.propTypes = {
  col: PropTypes.number.isRequired,
  handleSelect: PropTypes.func.isRequired,
  piece: PropTypes.element,
  row: PropTypes.number.isRequired,
  selectedCol: PropTypes.number.isRequired,
  selectedRow: PropTypes.number.isRequired,
};

Square.defaultProps = {
  piece: undefined,
};

export default Square;
