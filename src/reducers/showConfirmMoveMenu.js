const showConfirmMoveMenu = (state = false, action) => {
  switch (action.type) {
    case 'toggle_show_confirm_move_menu':
      return action.value;
    default:
      return state;
  }
};

export default showConfirmMoveMenu;
