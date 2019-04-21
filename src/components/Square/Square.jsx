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
  }

  handleClick() {
    const { piece, cellName, handleClick } = this.props;
    if (piece !== undefined) {
      handleClick(cellName);
    } else {
      handleClick(null);
    }
  }

  render() {
    const { piece, selected } = this.props;
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
  cellName: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  piece: PropTypes.element,
  selected: PropTypes.bool.isRequired,
};

Square.defaultProps = {
  piece: undefined,
};

export default Square;
