import * as logic from 'services/logic';

const setAnimationOffset = (state, { bottomPlayerIsRed, fromSlot, toSlot }) => {
  const [fromY, fromX] = logic.getRankFile(fromSlot);
  const [toY, toX] = logic.getRankFile(toSlot);

  return [
    bottomPlayerIsRed ? toX - fromX : fromX - toX,
    bottomPlayerIsRed ? toY - fromY : fromY - toY,
  ];
};

const animationOffset = (state = [0, 0], action) => {
  switch (action.type) {
    case 'set_animation_offset':
      return setAnimationOffset(state, action);
    case 'unset_animation_offset':
      return [0, 0];
    default:
      return state;
  }
};

export default animationOffset;

export const getIsMoving = state => state.some(dim => dim !== 0);
