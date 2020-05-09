import client, { isSuccess } from 'services/client';
import authenticate from 'actions/authenticate';

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
    return;
  }
};

export default login;
