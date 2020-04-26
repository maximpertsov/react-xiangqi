import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import App from 'App';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  loginForm: {},
  games: [],
});

test('renders without crashing', () => {
  const wrapper = render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  expect(wrapper).toMatchSnapshot();
});
