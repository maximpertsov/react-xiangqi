import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import * as images from './images';

const Wrapper = styled.img`
  pointer-events: none;
  user-select: none;
  -moz-user-select: none;
  max-height:80%;
  max-width:80%;
  display:block;
  margin:auto;
`;

export const Piece = ({ color, type, icon }) => {
  const alt = `${color} ${type}`;
  return (
    <Wrapper
      className="Piece"
      color={color}
      type={type}
      alt={alt}
      src={icon}
    />
  );
};

const pieceTypeData = {
  k:
     { icon: images.blackGeneral, color: 'black', type: 'general' },
  a:
     { icon: images.blackAdvisor, color: 'black', type: 'advisor' },
  e:
     { icon: images.blackElephant, color: 'black', type: 'elephant' },
  h:
     { icon: images.blackHorse, color: 'black', type: 'horse' },
  r:
     { icon: images.blackChariot, color: 'black', type: 'chariot' },
  c:
     { icon: images.blackCannon, color: 'black', type: 'cannon' },
  p:
     { icon: images.blackSoldier, color: 'black', type: 'soldier' },
  K:
     { icon: images.redGeneral, color: 'red', type: 'general' },
  A:
     { icon: images.redAdvisor, color: 'red', type: 'advisor' },
  E:
     { icon: images.redElephant, color: 'red', type: 'elephant' },
  H:
     { icon: images.redHorse, color: 'red', type: 'horse' },
  R:
     { icon: images.redChariot, color: 'red', type: 'chariot' },
  C:
     { icon: images.redCannon, color: 'red', type: 'cannon' },
  P:
      { icon: images.redSoldier, color: 'red', type: 'soldier' },
};

export const getPieceData = (code) => pieceTypeData[code];

export const sourcePropType = PropTypes.oneOfType([
  PropTypes.shape({
    uri: PropTypes.string,
    headers: PropTypes.objectOf(PropTypes.string),
  }),
  PropTypes.number,
  PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string,
      width: PropTypes.number,
      height: PropTypes.number,
      headers: PropTypes.objectOf(PropTypes.string),
    }),
  ),
]);

Piece.propTypes = {
  color: PropTypes.string.isRequired,
  icon: sourcePropType.isRequired,
  type: PropTypes.string.isRequired,
};
