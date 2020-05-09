import axios from 'axios';
import actions from 'actions';

import obtainToken from 'actions/login';

jest.mock('axios');

describe('login', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});

  test.skip('successfully obtain token', async () => {
    await store.dispatch(login({ username: null }));
  });
});
