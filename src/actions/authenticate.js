import actions from 'actions';
import updateLoginForm from 'actions/updateLoginForm';
import jwtDecode from 'jwt-decode';
import client, { isSuccess } from 'services/client';

const handleAuthenticationSuccess = (dispatch, { token }) => {
  const { username } = jwtDecode(token);
  dispatch(actions.home.username.set(username));
  dispatch(updateLoginForm({ error: '' }));
};

const authenticate = () => async dispatch => {
  try {
    const response = await client.post('token/refresh');

    if (isSuccess(response)) {
      handleAuthenticationSuccess(dispatch, response.data);
    }
  } catch (error) {
    return;
  } finally {
    dispatch(updateLoginForm({ username: '', password: '' }));
  }
};

export default authenticate;
