const loading = (state = true, action) => {
  switch (action.type) {
    case 'set_login_loading':
      return action.loading;
    default:
      return state;
  }
};

export default loading;
