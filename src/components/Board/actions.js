export const setSelectedSlot = ({ selectedSlot }) => ({
  type: 'set_selected_slot',
  selectedSlot,
});

export const clearSelectedSlot = () => setSelectedSlot({ selectedSlot: null });

export default {};
