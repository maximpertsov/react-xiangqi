import actions from 'actions';
import logout from 'actions/logout';
import updateLoginForm from 'actions/updateLoginForm';
import jwtDecode from 'jwt-decode';
import client, { isSuccess } from 'services/client';

const authenticate = () => async dispatch => {
  try {
    const response = await client.post('token/refresh', {
      refresh: localStorage.getItem('refresh'),
    });

    if (isSuccess(response)) {
      const { access } = response.data;
      const { username: user } = jwtDecode(access);

      localStorage.setItem('access', access);

      dispatch(actions.home.username.set(user));
    }
  } catch (error) {
    dispatch(logout());
  } finally {
    dispatch(updateLoginForm({ username: '', password: '' }));
  }
};

export default authenticate;
