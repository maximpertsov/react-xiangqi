import axios from 'axios';

import login from 'actions/login';
import * as authenticate from 'actions/authenticate';

jest.mock('axios');

describe('login', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});

  test('successful login', async () => {
    axios.post.mockResolvedValue({
      status: 200,
    });
    const spy = jest.spyOn(authenticate, 'default');
    const credentials = {
      username: 'user123',
      password: 'securepass',
    };

    await store.dispatch(login(credentials));

    expect(axios.post).toHaveBeenCalledWith('token/obtain', credentials);
    expect(spy).toHaveBeenCalledWith();

    spy.mockRestore();
  });
});
