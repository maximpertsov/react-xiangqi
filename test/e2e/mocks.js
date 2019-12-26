import { RequestMock } from 'testcafe';

export const APP_URL = 'http://localhost:3000';
// TODO: use env-specific URL
export const AUTH_URL = 'http://localhost:8000/api/authenticate';
export const PING_URL = 'http://localhost:8000/api/ping';

const ACCESS_CONTROL_HEADERS = {
  'access-control-allow-credentials': true,
  'access-control-allow-origin': APP_URL,
};

export const ping = RequestMock()
  .onRequestTo(PING_URL)
  .respond({ result: 'ok' }, 200, ACCESS_CONTROL_HEADERS);

export const authFail = RequestMock()
  .onRequestTo(AUTH_URL)
  .respond({}, 401, ACCESS_CONTROL_HEADERS);

export const authSuccess = RequestMock()
  .onRequestTo(AUTH_URL)
  .respond({ access_token: 'xyz.abc.ijk' }, 201, ACCESS_CONTROL_HEADERS);

export default {};
