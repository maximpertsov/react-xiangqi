const selectedSlot = (state = null, action) => {
  switch (action.type) {
    case 'set_selected_slot':
      return action.selectedSlot;
    default:
      return state;
  }
};

export default selectedSlot;
