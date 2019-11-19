import { RequestLogger, RequestMock, Selector } from 'testcafe';

const APP_URI = 'http://localhost:3000';
const AUTH_URI = 'http://localhost:8000/api/authenticate';

const ACCESS_CONTROL_HEADERS = {
  'access-control-allow-credentials': true,
  'access-control-allow-origin': APP_URI,
};

const logger = RequestLogger(AUTH_URI);
const mock = RequestMock().onRequestTo(AUTH_URI);

// Helper functions
const login = async(t) => t
  .click(Selector('button').withExactText('Login'));

fixture('Getting Started')
  .page(APP_URI)
  .requestHooks(logger);

test
  .requestHooks(mock.respond({}, 401, ACCESS_CONTROL_HEADERS))(
    'Failed login', async(t) => {
      await login(t);
      await t.expect(logger.contains((r) => r.response.statusCode === 401)).ok();
      await t.expect(Selector('div').withExactText('Login failed').exists).ok();
    });
