export const setSelectedSlot = ({ selectedSlot }) => ({
  type: 'set_selected_slot',
  selectedSlot,
});

export const clearSelectedSlot = () => setSelectedSlot({ selectedSlot: null });

export const setAnimationOffset = ({
  bottomPlayerIsRed,
  fromSlot,
  toSlot,
}) => ({
  type: 'set_animation_offset',
  bottomPlayerIsRed,
  fromSlot,
  toSlot,
});

export const clearAnimationOffset = () => ({
  type: 'clear_animation_offset',
});

export default {};
