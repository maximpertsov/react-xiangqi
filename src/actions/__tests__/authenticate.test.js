import axios from 'axios';
import actions from 'actions';
import jwtDecode from 'jwt-decode';

import authenticate from 'actions/authenticate';

jest.mock('axios');
jest.mock('jwt-decode');

describe('obtain a token', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});

  test('successful authentication', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        access: 'accessToken',
      },
    });
    jwtDecode.mockImplementationOnce(() => ({ sub: 'user123' }));

    await store.dispatch(authenticate());

    expect(axios.post).toHaveBeenCalledWith('token/refresh');
    expect(jwtDecode).toHaveBeenCalledWith('accessToken');
    expect(store.getActions()).toStrictEqual([
      actions.home.username.set('user123'),
    ]);
  });
});
