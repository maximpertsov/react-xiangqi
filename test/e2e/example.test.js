import { RequestLogger } from 'testcafe';

import { expectLoginFailure, login } from './utils';
import * as mocks from './mocks';

const logger = RequestLogger(mocks.AUTH_URI); // ([AUTH_URI, GAMES_URI]);

fixture('Login')
  .page(mocks.APP_URI)
  .requestHooks(logger);

test
  .requestHooks(mocks.authFail, mocks.ping)(
    'Fail to login', async(t) => {
      await login(t);
      await t.expect(logger.contains((r) => r.response.statusCode === 401)).ok();
      await expectLoginFailure(t);
    });

// // TODO: mock games endpoint
// // TODO: why isn't access_token in auth response?
// test
//   .requestHooks(mockAuthSuccess)(
//     'Login successfully', async(t) => {
//       await login(t);
//       logger.requests.forEach((r) => { console.log(r); });
//       await t.expect(logger.contains((r) => r.response.statusCode === 201)).ok();
//       await t.expect(Selector('button').withExactText('Login').exists).notOk();
//     });
