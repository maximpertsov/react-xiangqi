import { Selector } from 'testcafe';

export const login = async(t) => t
  .click(Selector('button').withExactText('Login'));

export default {};
