import React from 'react';
import PropTypes from 'prop-types';
import redGeneralIcon from './50px-Xiangqi_black_side_General.svg.png';

const Piece = ({ name, icon }) => (
  <img className="Piece" alt={name} src={icon} />
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
