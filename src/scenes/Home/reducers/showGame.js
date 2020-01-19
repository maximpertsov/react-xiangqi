const username = (state = false, action) => {
  switch (action.type) {
    case "toggle_show_game":
      return action.showGame;
    default:
      return state;
  }
};

export default username;
