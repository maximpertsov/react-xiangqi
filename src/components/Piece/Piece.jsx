import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import * as images from './images';

const Wrapper = styled.img`
  pointer-events: none;
  max-height:80%;
  max-width:80%;
  display:block;
  margin:auto;
`;

export const Piece = ({ name, icon }) => (
  <Wrapper className="Piece" alt={name} src={icon} />
);

export const BlackGeneral = () => (
  <Piece icon={images.blackGeneral} name="black general" />
);
export const BlackAdvisor = () => (
  <Piece icon={images.blackAdvisor} name="black advisor" />
);
export const BlackElephant = () => (
  <Piece icon={images.blackElephant} name="black elephant" />
);
export const BlackHorse = () => (
  <Piece icon={images.blackHorse} name="black horse" />
);
export const BlackChariot = () => (
  <Piece icon={images.blackChariot} name="black chariot" />
);
export const BlackCannon = () => (
  <Piece icon={images.blackCannon} name="black cannon" />
);
export const BlackSoldier = () => (
  <Piece icon={images.blackSoldier} name="black soldier" />
);
export const RedGeneral = () => (
  <Piece icon={images.redGeneral} name="red general" />
);
export const RedAdvisor = () => (
  <Piece icon={images.redAdvisor} name="red advisor" />
);
export const RedElephant = () => (
  <Piece icon={images.redElephant} name="red elephant" />
);
export const RedHorse = () => (
  <Piece icon={images.redHorse} name="red horse" />
);
export const RedChariot = () => (
  <Piece icon={images.redChariot} name="red chariot" />
);
export const RedCannon = () => (
  <Piece icon={images.redCannon} name="red cannon" />
);
export const RedSoldier = () => (
  <Piece icon={images.redSoldier} name="red soldier" />
);

Piece.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
