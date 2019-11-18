import { RequestLogger, Selector } from 'testcafe';

const logger = RequestLogger('http://localhost:8000/api/authenticate');

fixture('Getting Started')
  .page('http://localhost:3000')
  .requestHooks(logger);

test('Failing login', async(t) => {
  await t
    .click(Selector('button').withExactText('Login'))
    .expect(logger.contains((r) => r.response.statusCode === 401)).ok();
});
