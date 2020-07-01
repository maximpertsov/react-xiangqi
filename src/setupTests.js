import React from 'react';
import 'regenerator-runtime/runtime';

import * as redux from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import values from 'lodash/values';

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
  adapter: new Adapter(),
});

// HACK: replace synchronous useLayoutEffect with asynchronous useEffect to
// prevent a warning. See link below for more details:
//
//
// https://stackoverflow.com/questions/58070996/how-to-fix-the-warning-uselayouteffect-does-nothing-on-the-server
React.useLayoutEffect = React.useEffect;

// Timer configuration
jest.useFakeTimers();

afterEach(() => {
  jest.clearAllTimers();
});

// Utilities
global.mockStore = configureMockStore([thunk]);
global.setupReduxSpys = (spys, store) => {
  spys.useDispatch = jest.spyOn(redux, 'useDispatch');
  spys.useDispatch.mockReturnValue(store.dispatch);

  spys.useSelector = jest.spyOn(redux, 'useSelector');
  spys.useSelector.mockImplementation(callback => callback(store.getState()));
};
global.restoreSpys = spys => {
  values(spys).forEach(spy => spy.mockRestore());
};
global.shallowWrappedComponent = (component, store) =>
  shallow(<redux.Provider store={store}>{component}</redux.Provider>)
    .dive()
    .dive();
