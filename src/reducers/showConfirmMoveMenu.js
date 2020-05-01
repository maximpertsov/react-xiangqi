const showConfirmMoveMenu = (state = false, action) => {
  switch (action.type) {
    case 'GAME/SHOW_CONFIRM_MOVE_MENU/SET':
      return action.payload;
    default:
      return state;
  }
};

export default showConfirmMoveMenu;
