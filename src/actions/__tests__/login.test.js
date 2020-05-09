import axios from 'axios';

import login from 'actions/login';
import * as authenticate from 'actions/authenticate';
import * as updateLoginForm from 'actions/updateLoginForm';

jest.mock('axios');

describe('login', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});
  const credentials = {
    username: 'user123',
    password: 'securepass',
  };

  test('successful login', async () => {
    axios.post.mockResolvedValue({
      status: 200,
    });
    const spy = jest.spyOn(authenticate, 'default');
    await store.dispatch(login(credentials));

    expect(axios.post).toHaveBeenCalledWith('token/obtain', credentials);
    expect(spy).toHaveBeenCalledWith();

    spy.mockRestore();
  });

  test('failed login', async () => {
    axios.post.mockRejectedValue({
      status: 400,
    });
    const spy = jest.spyOn(updateLoginForm, 'default');

    await store.dispatch(login(credentials));
    expect(axios.post).toHaveBeenCalledWith('token/obtain', credentials);
    expect(spy).toHaveBeenCalledWith({ error: 'Login failed' });

    spy.mockRestore();
  });
});
