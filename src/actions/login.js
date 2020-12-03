import authenticate from 'actions/authenticate';
import updateLoginForm from 'actions/updateLoginForm';
import client, { isSuccess } from 'services/client';

const login = ({ username, password }) => async dispatch => {
  try {
    const response = await client.post('token', {
      username,
      password,
    });

    if (isSuccess(response)) {
      dispatch(authenticate());
      dispatch(updateLoginForm({ error: '' }));
    }
  } catch (error) {
    dispatch(updateLoginForm({ error: 'Login failed' }));
  } finally {
    dispatch(updateLoginForm({ username: '', password: '' }));
  }
};

export default login;
