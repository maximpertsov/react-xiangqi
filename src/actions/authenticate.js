import jwtDecode from 'jwt-decode';
import actions from 'actions';
import client, { isSuccess } from 'services/client';

const handleAuthenticationSuccess = (dispatch, { access }) => {
  const { sub } = jwtDecode(access);
  dispatch(actions.home.username.set(sub));
};

const authenticate = () => async dispatch => {
  try {
    const response = await client.post('token/refresh');

    if (isSuccess(response)) {
      handleAuthenticationSuccess(dispatch, response.data);
    }
  } catch (error) {
    return;
  }
};

export default authenticate;
