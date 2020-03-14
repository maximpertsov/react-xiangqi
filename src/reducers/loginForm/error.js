const error = (state = '', action) => {
  switch (action.type) {
    case 'set_login_error':
      return action.error;
    default:
      return state;
  }
};

export default error;
