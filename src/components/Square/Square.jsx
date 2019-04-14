import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Square = ({ piece }) => (
  <Wrapper className="Square">{piece}</Wrapper>
);

Square.propTypes = {
  piece: PropTypes.element.isRequired,
};

export default Square;
