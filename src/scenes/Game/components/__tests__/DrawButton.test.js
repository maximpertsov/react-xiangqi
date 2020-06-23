import React from 'react';
import * as redux from 'react-redux';
import { shallow } from 'enzyme';
import values from 'lodash/values';

import DrawButton from 'scenes/Game/components/DrawButton';

const getComponent = store => (
  <redux.Provider store={store}>
    <DrawButton />
  </redux.Provider>
);

describe('DrawButton', () => {
  // eslint-disable-next-line no-undef
  const store = mockStore({});
  const spys = {};

  afterEach(() => {
    store.clearActions();
    values(spys).forEach(spy => spy.mockRestore());
  });

  test('renders without crashing', () => {
    spys.useDispatch = jest.spyOn(redux, 'useDispatch');
    spys.useDispatch.mockReturnValue(store.dispatch);

    const wrapper = shallow(getComponent(store))
      .dive()
      .dive();
    expect(wrapper).toMatchSnapshot();
  });
});
