import { Selector } from 'testcafe';

export const login = async(t) => t
  .click(Selector('button').withExactText('Login'));

export const expectLoginFailure = async(t) => t
  .expect(Selector('div').withExactText('Login failed').exists).ok();

export default {};
