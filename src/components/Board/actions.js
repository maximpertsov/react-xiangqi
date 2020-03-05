import { decodeMove } from 'services/logic/square';

export const setSelectedSlot = ({ selectedSquare }) => ({
  type: 'set_selected_slot',
  selectedSquare,
});

export const clearSelectedSlot = () => setSelectedSlot({ selectedSquare: null });

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
