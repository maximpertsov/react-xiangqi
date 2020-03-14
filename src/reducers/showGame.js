const showGame = (state = false, action) => {
  switch (action.type) {
    case "toggle_show_game":
      return action.showGame;
    default:
      return state;
  }
};

export default showGame;
