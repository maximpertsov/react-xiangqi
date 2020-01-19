const username = (state = null, action) => {
  switch (action.type) {
    case "set_username":
      return action.username;
    default:
      return state;
  }
};

export default username;
