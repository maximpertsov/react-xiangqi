/** @jsx jsx */
import { jsx } from '@emotion/core';

import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import XiangqiPiece from '../Piece/Piece';

const LAST_MOVE_COLOR = 'rgb(170,143,121,0.3)';
const SELECTION_GREEN = 'rgba(30,179,0,0.3)';
const IN_CHECK_RED = 'red';

const fillParentElement = {
  height: '100%',
  width: '100%',
  position: 'absolute',
};

const LastMoveIndicator = styled.div({
  backgroundColor: LAST_MOVE_COLOR,
  zIndex: '-1',
  ...fillParentElement,
});

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
  handleClick, pieceCode, selected, inCheck, inLastMove, targeted, moveX, moveY,
}) => {
  const occupied = pieceCode !== undefined;
  const moving = moveX !== 0 || moveY !== 0;

  const selectedMoveX = selected ? moveX : 0;
  const selectedMoveY = selected ? moveY : 0;

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
      {inLastMove && <LastMoveIndicator />}
      {selected && !(moving) && <SelectionIndicator />}
      {
        occupied &&
          <XiangqiPiece
            moveX={selectedMoveX}
            moveY={selectedMoveY}
            code={pieceCode}
          />
      }
      {targeted && !(moving) && <TargetIndicator occupied={occupied} />}
      {inCheck && !(moving) && <KingCheckedIndicator />}
    </div>
  );
};

Square.propTypes = {
  handleClick: PropTypes.func.isRequired,
  pieceCode: PropTypes.string,
  selected: PropTypes.bool.isRequired,
  inCheck: PropTypes.bool.isRequired,
  inLastMove: PropTypes.bool.isRequired,
  targeted: PropTypes.bool.isRequired,
  moveX: PropTypes.number,
  moveY: PropTypes.number,
};

Square.defaultProps = {
  pieceCode: undefined,
  moveX: 0,
  moveY: 0,
};

export default Square;
