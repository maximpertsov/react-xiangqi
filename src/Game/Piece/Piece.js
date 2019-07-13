/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';
import * as images from './images';

const Piece = ({ color, type, icon }) => {
  const alt = `${color} ${type}`;

  return (
    <img
      className="Piece"
      css={css`
        pointer-events: none;
        user-select: none;
        -moz-user-select: none;
        max-height: 80%;
        max-width: 80%;
        display: block;
        margin: auto;
      `}
      alt={alt}
      src={icon}
    />
  );
};

export const sourcePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.shape({
    uri: PropTypes.string,
    headers: PropTypes.objectOf(PropTypes.string),
  }),
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

const XiangqiPiece = ({ code }) => {
  const pieceByCode = {
    k: <Piece icon={images.blackGeneral} color="black" type="general" />,
    a: <Piece icon={images.blackAdvisor} color="black" type="advisor" />,
    e: <Piece icon={images.blackElephant} color="black" type="elephant" />,
    h: <Piece icon={images.blackHorse} color="black" type="horse" />,
    r: <Piece icon={images.blackChariot} color="black" type="chariot" />,
    c: <Piece icon={images.blackCannon} color="black" type="cannon" />,
    p: <Piece icon={images.blackSoldier} color="black" type="soldier" />,
    K: <Piece icon={images.redGeneral} color="red" type="general" />,
    A: <Piece icon={images.redAdvisor} color="red" type="advisor" />,
    E: <Piece icon={images.redElephant} color="red" type="elephant" />,
    H: <Piece icon={images.redHorse} color="red" type="horse" />,
    R: <Piece icon={images.redChariot} color="red" type="chariot" />,
    C: <Piece icon={images.redCannon} color="red" type="cannon" />,
    P: <Piece icon={images.redSoldier} color="red" type="soldier" />,
  };

  return pieceByCode[code];
};

XiangqiPiece.propTypes = {
  code: PropTypes.oneOf([
    'k',
    'a',
    'e',
    'h',
    'r',
    'c',
    'p',
    'K',
    'A',
    'E',
    'H',
    'R',
    'C',
    'P',
  ]).isRequired,
};

export default XiangqiPiece;
