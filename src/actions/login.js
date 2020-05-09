import client, { isSuccess } from 'services/client';
import authenticate from 'actions/authenticate';
import updateLoginForm from 'actions/updateLoginForm';

const login = ({ username, password }) => async dispatch => {
  try {
    const response = await client.post('token/obtain', {
      username,
      password,
    });

    if (isSuccess(response)) {
      dispatch(authenticate());
    }
  } catch (error) {
    dispatch(updateLoginForm({ error: 'Login failed' }));
  } finally {
    dispatch(updateLoginForm({ username: '', password: '' }));
  }
};

export default login;
