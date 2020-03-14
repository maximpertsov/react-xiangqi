const username = (state = '', action) => {
  switch (action.type) {
    case 'set_login_username':
      return action.username;
    default:
      return state;
  }
};

export default username;
