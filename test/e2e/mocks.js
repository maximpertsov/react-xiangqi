import { RequestMock } from 'testcafe';

export const APP_URI = 'http://localhost:3000';
export const AUTH_URI = 'http://localhost:8000/api/authenticate';
export const PING_URI = 'http://localhost:8000/api/ping';
// const GAMES_URI = /http:\/\/localhost:8000\/api\/\w+\/games/;

const ACCESS_CONTROL_HEADERS = {
  'access-control-allow-credentials': true,
  'access-control-allow-origin': APP_URI,
};

export const ping = RequestMock()
  .onRequestTo(PING_URI)
  .respond({ result: 'ok' }, 200, ACCESS_CONTROL_HEADERS);

export const authFail = RequestMock()
  .onRequestTo(AUTH_URI)
  .respond({}, 401, ACCESS_CONTROL_HEADERS);

export const authSuccess = RequestMock()
  .onRequestTo(AUTH_URI)
  .respond({ access_token: 'xyz.abc.ijk' }, 201, ACCESS_CONTROL_HEADERS);
  // .onRequestTo(GAMES_URI)
  // .respond({ games: [{ slug: 'ABC123' }] }, 200, ACCESS_CONTROL_HEADERS);

export default {};
