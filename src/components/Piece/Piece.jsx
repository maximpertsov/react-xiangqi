import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import redGeneralIcon from './50px-Xiangqi_black_side_General.svg.png';

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
  icon: PropTypes.string,
  name: PropTypes.string,
};

Piece.defaultProps = {
  icon: redGeneralIcon,
  name: 'Red General',
};

export default Piece;
