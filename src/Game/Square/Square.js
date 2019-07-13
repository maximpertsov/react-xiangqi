/** @jsx jsx */
import { jsx } from '@emotion/core';

import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import XiangqiPiece from '../Piece/Piece';

const SELECTION_GREEN = 'rgba(30, 179, 0, 0.3)';
const IN_CHECK_RED = 'red';

const TargetedEmptySquare = styled.div`
  width:50%;
  height:50%;
  position:relative;
  top:50%;
  transform:translateY(-50%);
  border-radius:50%;
  background:${SELECTION_GREEN};
`;

const Square = ({
  handleSquareClick,
  pieceCode,
  slot,
  selected,
  inCheckSlot,
  targeted,
}) => {
  const isOccupied = () => pieceCode !== undefined;

  const renderSquareElement = () => {
    if (isOccupied()) return <XiangqiPiece code={pieceCode} />;
    if (targeted) return (<TargetedEmptySquare />);
    return (<div />);
  };

  const attacked = () => isOccupied() && targeted;

  const inCheck = () => slot === inCheckSlot;

  const handleClick = () => {
    handleSquareClick(slot);
  };

  return (
    <div
      className="Square"
      onClick={handleClick}
      css={{
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px;',
        padding: '0px;',
        ...selected && {
          backgroundColor: SELECTION_GREEN,
        },
        ...attacked() && {
          outline: `2px dotted ${SELECTION_GREEN}`,
          outlineOffset: `2px ${SELECTION_GREEN}`,
        },
        ...inCheck() && {
          outline: `2px dotted ${IN_CHECK_RED}`,
        },
      }}
    >
      {renderSquareElement()}
    </div>
  );
};

Square.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
  pieceCode: PropTypes.string,
  slot: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  inCheckSlot: PropTypes.number,
  targeted: PropTypes.bool.isRequired,
};

Square.defaultProps = {
  pieceCode: undefined,
  inCheckSlot: null,
};

export default Square;
