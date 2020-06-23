import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';

import DrawButton from 'scenes/Game/components/DrawButton';

// eslint-disable-next-line no-undef
const store = mockStore({});

const getComponent = store => (
  <Provider store={store}>
    <DrawButton />
  </Provider>
);

describe('DrawButton', () => {
  test('renders without crashing', () => {
    const wrapper = shallow(getComponent(store)).dive().dive();
    expect(wrapper).toMatchSnapshot();
  });
});
