import values from 'lodash/values';

import * as authenticate from 'actions/authenticate';
import login from 'actions/login';
import * as updateLoginForm from 'actions/updateLoginForm';
import axios from 'axios';

jest.mock('axios');

describe('login', () => {
  const store = mockStore({});
  const credentials = {
    username: 'user123',
    password: 'securepass',
  };
  const spys = {};

  afterEach(() => {
    store.clearActions();
    values(spys).forEach(spy => spy.mockRestore());
  });

  test('successful login', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    spys.authenticate = jest.spyOn(authenticate, 'default');
    spys.updateLoginForm = jest.spyOn(updateLoginForm, 'default');

    await store.dispatch(login(credentials));

    expect(axios.post).toHaveBeenCalledWith('token', credentials);
    expect(spys.authenticate).toHaveBeenCalledWith();
    expect(spys.updateLoginForm).toHaveBeenCalledWith({
      error: '',
    });
    expect(spys.updateLoginForm).toHaveBeenCalledWith({
      username: '',
      password: '',
    });
  });

  test('failed login', async () => {
    axios.post.mockRejectedValue({ status: 400 });
    spys.updateLoginForm = jest.spyOn(updateLoginForm, 'default');

    await store.dispatch(login(credentials));

    expect(axios.post).toHaveBeenCalledWith('token', credentials);
    expect(spys.updateLoginForm).toHaveBeenCalledWith({
      error: 'Login failed',
    });
    expect(spys.updateLoginForm).toHaveBeenCalledWith({
      username: '',
      password: '',
    });
  });
});
