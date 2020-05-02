import actions from 'actions';

const updateLoginForm = form => dispatch => {
  const { username, password, error } = form;
  if (username !== undefined) {
    dispatch(actions.home.loginForm.username.set(username));
  }
  if (password !== undefined) {
    dispatch(actions.home.loginForm.password.set(password));
  }
  if (error !== undefined) {
    dispatch(actions.home.loginForm.error.set(error));
  }
};

export default updateLoginForm;
