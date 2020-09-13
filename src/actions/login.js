import actions from 'actions';
import logout from 'actions/logout';
import updateLoginForm from 'actions/updateLoginForm';
import jwtDecode from 'jwt-decode';
import client from 'services/client';

const login = ({ username, password }) => async dispatch => {
  try {
    const {
      data: { access, refresh },
    } = await client.post('token', { username, password });
    const { username: user } = jwtDecode(access);

    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);

    dispatch(actions.home.username.set(user));
  } catch (error) {
    dispatch(updateLoginForm({ error: 'Login failed' }));
    dispatch(logout());
  } finally {
    dispatch(updateLoginForm({ username: '', password: '' }));
  }
};

export default login;
