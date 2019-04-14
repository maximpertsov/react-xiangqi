import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled.img`
  pointer-events: none;
  max-height:80%;
  max-width:80%;
  display:block;
  margin:auto;
`;

const Piece = ({ name, icon }) => (
  <Wrapper className="Piece" alt={name} src={icon} />
);

Piece.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Piece;
