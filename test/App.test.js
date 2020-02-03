import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Enzyme, { render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureMockStore from 'redux-mock-store';
import App from '../src/App';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  loginForm: {},
  games: [],
});

Enzyme.configure({ adapter: new Adapter() });

test('renders without crashing', () => {
  const wrapper = render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  expect(wrapper).toMatchSnapshot();
});
