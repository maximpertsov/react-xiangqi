/** @jsx jsx */
import { jsx } from '@emotion/core';

import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import XiangqiPiece from '../Piece/Piece';

const SELECTION_GREEN = 'rgba(30, 179, 0, 0.3)';
const IN_CHECK_RED = 'red';

const fillParentElement = {
  height: '100%',
  width: '100%',
  position: 'absolute',
};

const SelectionIndicator = styled.div({
  backgroundColor: SELECTION_GREEN,
  zIndex: '-1',
  ...fillParentElement,
});

const TargetIndicator = styled.div(({ occupied }) => ({
  ...(occupied) ? {
    outline: `2px dotted ${SELECTION_GREEN}`,
    ...fillParentElement,
  } : {
    backgroundColor: SELECTION_GREEN,
    borderRadius: '50%',
    height: '50%',
    width: '50%',
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

const KingCheckedIndicator = styled.div({
  outline: `2px dotted ${IN_CHECK_RED}`,
  ...fillParentElement,
});


const Square = ({
  handleSquareClick,
  pieceCode,
  slot,
  selected,
  inCheck,
  targeted,
}) => {
  const handleClick = () => { handleSquareClick(slot); };
  const occupied = pieceCode !== undefined;

  return (
    <div
      className="Square"
      onClick={handleClick}
      css={{
        display: 'flex',
        justifyContent: 'center',
        margin: '0px;',
        padding: '0px;',
        position: 'relative',
      }}
    >
      {selected && <SelectionIndicator />}
      {occupied && <XiangqiPiece code={pieceCode} />}
      {targeted && <TargetIndicator occupied={occupied} />}
      {inCheck && <KingCheckedIndicator />}
    </div>
  );
};

Square.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
  pieceCode: PropTypes.string,
  slot: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  inCheck: PropTypes.bool.isRequired,
  targeted: PropTypes.bool.isRequired,
};

Square.defaultProps = {
  pieceCode: undefined,
  inCheckSlot: null,
};

export default Square;
