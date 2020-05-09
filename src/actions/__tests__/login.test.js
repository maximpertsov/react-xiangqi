import axios from 'axios';
import actions from 'actions';

import obtainToken from 'actions/obtainToken';

jest.mock('axios');

describe('obtain a token', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});

  test('successfully obtain token', async () => {
    await store.dispatch(obtainToken({ username: null }));
  });
});
