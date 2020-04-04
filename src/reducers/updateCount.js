const updateCount = (state = 0, action) => {
  switch (action.type) {
    case "set_update_count":
      return action.updateCount;
    default:
      return state;
  }
};

export default updateCount;
