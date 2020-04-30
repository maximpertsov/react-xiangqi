import { decodeMove } from 'services/logic/square';

export const setAnimationOffset = ({ bottomPlayerIsRed, move }) => {
  const [fromSlot, toSlot] = decodeMove(move);

  return {
    type: 'set_animation_offset',
    bottomPlayerIsRed,
    fromSlot,
    toSlot,
  };
};

export const clearAnimationOffset = () => ({
  type: 'clear_animation_offset',
});

export default {};
