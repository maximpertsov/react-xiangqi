import { decodeMove } from 'services/logic/square';

export const setSelectedSlot = ({ selectedSlot }) => ({
  type: 'set_selected_slot',
  selectedSlot,
});

export const clearSelectedSlot = () => setSelectedSlot({ selectedSlot: null });

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
