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
    this.state = { selected: false };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((state) => ({ selected: !state.selected }));
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
  piece: PropTypes.element.isRequired,
  // selected: PropTypes.bool.isRequired,
};

export default Square;
