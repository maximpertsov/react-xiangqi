import React from 'react';
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

const Square = ({ piece, selected }) => (
  <Wrapper className="Square" selected={selected}>
    {piece}
  </Wrapper>
);

Square.propTypes = {
  piece: PropTypes.element.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default Square;
