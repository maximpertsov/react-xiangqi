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
    const { piece, selectedPiece } = nextProps;

    if (piece === selectedPiece) {
      this.setState((prevState) => ({ selected: !prevState.selected }));
    } else {
      this.setState({ selected: false });
    }
  }

  handleClick() {
    const { piece, handleClick } = this.props;
    if (piece !== undefined) {
      handleClick(piece);
    } else {
      handleClick(null);
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
  handleClick: PropTypes.func.isRequired,
  piece: PropTypes.element,
  selectedPiece: PropTypes.element.isRequired,
};

Square.defaultProps = {
  piece: undefined,
};

export default Square;
