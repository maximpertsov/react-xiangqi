import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

import { getIsMoving } from 'reducers';
import XiangqiPiece from './components/Piece';

const LAST_MOVE_COLOR = 'rgba(201,255,229,1.0)';
const SELECTION_COLOR = 'rgba(30,179,0,0.3)';
const IN_CHECK_COLOR = 'red';

const fillParentElement = {
  height: '100%',
  width: '100%',
  position: 'absolute',
};

const LastMoveIndicator = styled.div({
  backgroundColor: LAST_MOVE_COLOR,
  borderRadius: '50%',
  zIndex: '-1',
  ...fillParentElement,
});

const SelectionIndicator = styled.div({
  backgroundColor: SELECTION_COLOR,
  zIndex: '-1',
  ...fillParentElement,
});

const TargetOccupiedIndicator = styled.div({
  backgroundColor: SELECTION_COLOR,
  borderRadius: '50%',
  ...fillParentElement,
});

const TargetEmptyIndicator = styled.div({
  backgroundColor: SELECTION_COLOR,
  borderRadius: '50%',
  height: '50%',
  position: 'relative',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '50%',
});

const TargetIndicator = ({ occupied }) =>
  occupied ? <TargetOccupiedIndicator /> : <TargetEmptyIndicator />;

TargetIndicator.propTypes = {
  occupied: PropTypes.bool.isRequired,
};

const KingCheckedIndicator = styled.div({
  backgroundColor: IN_CHECK_COLOR,
  borderRadius: '50%',
  zIndex: '-1',
  ...fillParentElement,
});

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0px;
  padding: 0px;
  position: relative;
`;

const Square = ({
  handleClick,
  inCheck,
  inLastMove,
  pieceCode,
  selected,
  targeted,
}) => {
  const [moveX, moveY] = useSelector(state => state.animationOffset);
  const isMoving = useSelector(state => getIsMoving(state));
  const occupied = pieceCode !== undefined;

  const selectedMoveX = selected ? moveX : 0;
  const selectedMoveY = selected ? moveY : 0;

  /* eslint-disable jsx-a11y/no-static-element-interactions */
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  return (
    <Wrapper className="Square" onClick={handleClick}>
      {inLastMove && <LastMoveIndicator />}
      {selected && !isMoving && <SelectionIndicator />}
      {occupied && (
        <XiangqiPiece
          moveX={selectedMoveX}
          moveY={selectedMoveY}
          code={pieceCode}
        />
      )}
      {targeted && !isMoving && <TargetIndicator occupied={occupied} />}
      {inCheck && !isMoving && <KingCheckedIndicator />}
    </Wrapper>
  );
  /* eslint-enable jsx-a11y/no-static-element-interactions */
  /* eslint-enable jsx-a11y/click-events-have-key-events */
};

Square.propTypes = {
  handleClick: PropTypes.func.isRequired,
  pieceCode: PropTypes.string,
  selected: PropTypes.bool.isRequired,
  inCheck: PropTypes.bool.isRequired,
  inLastMove: PropTypes.bool.isRequired,
  targeted: PropTypes.bool.isRequired,
};

Square.defaultProps = {
  pieceCode: undefined,
};

export default Square;
