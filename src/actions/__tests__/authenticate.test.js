import axios from 'axios';
import jwtDecode from 'jwt-decode';
import values from 'lodash/values';

import actions from 'actions';
import authenticate from 'actions/authenticate';
import * as updateLoginForm from 'actions/updateLoginForm';

jest.mock('axios');
jest.mock('jwt-decode');

describe('obtain a token', () => {
  const store = mockStore({});
  const spys = {};

  afterEach(() => {
    store.clearActions();
    values(spys).forEach(spy => spy.mockRestore());
  });

  test('successful authentication', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        token: 'accessToken',
      },
    });
    jwtDecode.mockImplementationOnce(() => ({ username: 'user123' }));
    spys.updateLoginForm = jest.spyOn(updateLoginForm, 'default');

    await store.dispatch(authenticate());

    expect(axios.post).toHaveBeenCalledWith('token/refresh');
    expect(jwtDecode).toHaveBeenCalledWith('accessToken');
    expect(store.getActions()).toStrictEqual(
      expect.arrayContaining([actions.home.username.set('user123')]),
    );
    expect(spys.updateLoginForm).toHaveBeenCalledWith({
      error: '',
    });
    expect(spys.updateLoginForm).toHaveBeenCalledWith({
      username: '',
      password: '',
    });
  });
});
