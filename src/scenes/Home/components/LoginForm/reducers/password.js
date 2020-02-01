const password = (state = '', action) => {
  switch (action.type) {
    case 'set_login_password':
      return action.password;
    default:
      return state;
  }
};

export default password;
