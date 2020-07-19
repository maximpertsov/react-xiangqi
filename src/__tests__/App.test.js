import React from 'react';
import { Provider } from 'react-redux';

import App from 'App';
import { render } from 'enzyme';

test('renders without crashing', () => {
  const store = mockStore({ loginForm: {}, games: [] });

  const wrapper = render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  expect(wrapper).toMatchSnapshot();
});
