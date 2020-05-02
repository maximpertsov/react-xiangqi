import * as client from 'services/client';

export const setForm = form => dispatch => {
  const { username, password, error } = form;
  if (username !== undefined) {
    dispatch({ type: 'set_login_username', username });
  }
  if (password !== undefined) {
    dispatch({ type: 'set_login_password', password });
  }
  if (error !== undefined) {
    dispatch({ type: 'set_login_error', error });
  }
};

export default {};
