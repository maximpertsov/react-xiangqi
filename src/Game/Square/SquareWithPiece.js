/** @jsx jsx */
import { jsx } from '@emotion/core';

import PropTypes from 'prop-types';
import XiangqiPiece from '../Piece/Piece';

const SELECTION_GREEN = 'rgba(30, 179, 0, 0.3)';
const IN_CHECK_RED = 'red';

const SquareWithPiece = ({
  handleClick,
  pieceCode,
  slot,
  selected,
  inCheckSlot,
  targeted,
}) => {
  const isOccupied = () => pieceCode !== undefined;

  const attacked = () => isOccupied() && targeted;

  const inCheck = () => slot === inCheckSlot;

  const getOutline = () => {
    if (attacked()) return `2px dotted ${SELECTION_GREEN}`;
    if (inCheck()) return `2px dotted ${IN_CHECK_RED}`;
    return 'none';
  };

  return (
    <div
      onClick={handleClick}
      css={{
        backgroundColor: selected ? SELECTION_GREEN : 'none',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px;',
        outline: getOutline(),
        outlineOffset: attacked() ? '-2px' : 'none',
        padding: '0px;',
      }}
    >
      <XiangqiPiece code={pieceCode} />
    </div>
  );
};

SquareWithPiece.propTypes = {
  handleClick: PropTypes.func.isRequired,
  pieceCode: PropTypes.string.isRequired,
  slot: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  inCheckSlot: PropTypes.number,
  targeted: PropTypes.bool.isRequired,
};

SquareWithPiece.defaultProps = {
  inCheckSlot: null,
};

export default SquareWithPiece;
