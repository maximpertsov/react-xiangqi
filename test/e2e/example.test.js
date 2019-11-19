import { RequestLogger, RequestMock, Selector } from 'testcafe';

const APP_URI = 'http://localhost:3000';
const API_URI = 'http://localhost:8000';

const logger = RequestLogger(`${API_URI}/api/authenticate`);
const mock = RequestMock()
  .onRequestTo(`${API_URI}/api/authenticate`)
  .respond({}, 401, {
    'access-control-allow-credentials': true,
    'access-control-allow-origin': APP_URI
  });

fixture('Getting Started')
  .page(APP_URI)
  .requestHooks(logger);

test
  .requestHooks(mock)(
    'Failing login', async(t) => {
      await t
        .click(Selector('button').withExactText('Login'))
        .expect(logger.contains((r) => r.response.statusCode === 401)).ok()
        .expect(Selector('div').withExactText('Login failed').exists).ok();
    });
