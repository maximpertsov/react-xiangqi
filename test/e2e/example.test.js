import { RequestLogger, RequestMock, Selector } from 'testcafe';

const APP_URI = 'http://localhost:3000';
const AUTH_URI = 'http://localhost:8000/api/authenticate';

const ACCESS_CONTROL_HEADERS = {
  'access-control-allow-credentials': true,
  'access-control-allow-origin': APP_URI,
};

const logger = RequestLogger(AUTH_URI);
const mock_auth_fail = RequestMock()
  .onRequestTo(AUTH_URI)
  .respond({}, 401, ACCESS_CONTROL_HEADERS);
const mock_auth_success = RequestMock()
  .onRequestTo(AUTH_URI)
  .respond({}, 201, ACCESS_CONTROL_HEADERS);

// Helper functions
const login = async(t) => t
  .click(Selector('button').withExactText('Login'));

fixture('Getting Started')
  .page(APP_URI)
  .requestHooks(logger);

test
  .requestHooks(mock_auth_fail)(
    'Fail to login', async(t) => {
      await login(t);
      await t.expect(logger.contains((r) => r.response.statusCode === 401)).ok();
      await t.expect(Selector('div').withExactText('Login failed').exists).ok();
    });

test
  .requestHooks(mock_auth_success)(
    'Login successfully', async(t) => {
      await login(t);
      await t.expect(logger.contains((r) => r.response.statusCode === 201)).ok();
      // await t.expect(Selector('div').withExactText('Games in play').exists).ok();
    });
