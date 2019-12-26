import { RequestLogger, Selector } from 'testcafe';

import { expectLoginFailure, expectUnauthorized, login } from './utils';
import * as mocks from './mocks';

const logger = RequestLogger(
  mocks.AUTH_URL,
  {
    logResponseBody: true,
    stringifyResponseBody: true,
  }
);

fixture('Login')
  .page(mocks.APP_URL)
  .requestHooks(logger);

test
  .requestHooks(mocks.authFail, mocks.ping)(
    'Fail to login', async(t) => {
      await login(t);
      // TODO: remove the next test after mocking setup is confirmed to be
      // working correctly
      await expectUnauthorized(t, logger);
      await expectLoginFailure(t);
    });

test
  .requestHooks(mocks.authFail, mocks.ping)(
    'Login successfully', async(t) => {
      await t.expect(Selector('button').withExactText('Login').exists).ok();
      await t.removeRequestHooks(mocks.authFail)
      await t.addRequestHooks(mocks.authSuccess)
      await login(t)
      // logger.requests.forEach((r) => { console.log(r); });
      // await t.expect(logger.contains((r) => r.response.statusCode === 201)).ok();
      // await t.expect(Selector('button').withExactText('Login').exists).notOk();
    });
