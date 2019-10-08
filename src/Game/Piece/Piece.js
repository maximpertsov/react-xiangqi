/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import PropTypes from 'prop-types';
import * as images from './images';
import * as styles from '../../commonStyles';

const Piece = ({
  color, type, icon, moveX, moveY,
}) => {
  const alt = `${color} ${type}`;
  const moving = moveX !== 0 || moveY !== 0;

  const cssTransform = (squareSize) => {
    const xTranslate = `calc(${squareSize} * ${moveX})`;
    const yTranslate = `calc(${squareSize} * ${moveY})`;

    return `transform: translate(${xTranslate}, ${yTranslate})`;
  };

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
        z-index: ${moving ? 100 : 0};
        transition: transform 100ms ease-in-out;
        ${styles.MEDIA_TINY} {
          ${cssTransform(styles.SQUARE_SIZE_TINY)};
        }
        ${styles.MEDIA_SMALL} {
          ${cssTransform(styles.SQUARE_SIZE_SMALL)};
        }
        ${styles.MEDIA_MEDIUM} {
          ${cssTransform(styles.SQUARE_SIZE_MEDIUM)};
        }
        ${styles.MEDIA_LARGE} {
          ${cssTransform(styles.SQUARE_SIZE_LARGE)};
        }
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
  moveX: PropTypes.number,
  moveY: PropTypes.number,
};

Piece.defaultProps = {
  moveX: 0,
  moveY: 0,
};

const XiangqiPiece = ({ code, moveX, moveY }) => {
  const pieceByCode = {
    k: <Piece moveX={moveX} moveY={moveY} icon={images.blackGeneral} color="black" type="general" />,
    a: <Piece moveX={moveX} moveY={moveY} icon={images.blackAdvisor} color="black" type="advisor" />,
    e: <Piece moveX={moveX} moveY={moveY} icon={images.blackElephant} color="black" type="elephant" />,
    h: <Piece moveX={moveX} moveY={moveY} icon={images.blackHorse} color="black" type="horse" />,
    r: <Piece moveX={moveX} moveY={moveY} icon={images.blackChariot} color="black" type="chariot" />,
    c: <Piece moveX={moveX} moveY={moveY} icon={images.blackCannon} color="black" type="cannon" />,
    p: <Piece moveX={moveX} moveY={moveY} icon={images.blackSoldier} color="black" type="soldier" />,
    K: <Piece moveX={moveX} moveY={moveY} icon={images.redGeneral} color="red" type="general" />,
    A: <Piece moveX={moveX} moveY={moveY} icon={images.redAdvisor} color="red" type="advisor" />,
    E: <Piece moveX={moveX} moveY={moveY} icon={images.redElephant} color="red" type="elephant" />,
    H: <Piece moveX={moveX} moveY={moveY} icon={images.redHorse} color="red" type="horse" />,
    R: <Piece moveX={moveX} moveY={moveY} icon={images.redChariot} color="red" type="chariot" />,
    C: <Piece moveX={moveX} moveY={moveY} icon={images.redCannon} color="red" type="cannon" />,
    P: <Piece moveX={moveX} moveY={moveY} icon={images.redSoldier} color="red" type="soldier" />,
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
