import 'regenerator-runtime/runtime';
import { registerAssertions } from 'redux-actions-assertions/jest';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
  adapter: new Adapter(),
});

beforeEach(registerAssertions);
