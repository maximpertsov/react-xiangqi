import React from 'react';
import { Provider } from 'react-redux';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureMockStore from 'redux-mock-store';
import App from '../src/App';

const mockStore = configureMockStore();
const store = mockStore({
  loginForm: {},
  games: [],
});

Enzyme.configure({ adapter: new Adapter() });

test('renders without crashing', () => {
  mount(
    <Provider store={store}>
      <App />
    </Provider>,
  );
});
