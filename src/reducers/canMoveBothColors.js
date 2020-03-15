const canMoveBothColors = (state = false, action) => {
  switch (action.type) {
    case "toggle_can_move_both_colors":
      return action.canMoveBothColors;
    default:
      return state;
  }
};

export default canMoveBothColors;
