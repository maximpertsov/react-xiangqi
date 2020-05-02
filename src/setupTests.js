import React from 'react';
import 'regenerator-runtime/runtime';

import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
  adapter: new Adapter(),
});

// HACK: replace synchronous useLayoutEffect with asynchronous useEffect to
// prevent a warning. See link below for more details:
//
// https://stackoverflow.com/questions/58070996/how-to-fix-the-warning-uselayouteffect-does-nothing-on-the-server
React.useLayoutEffect = React.useEffect;

// Timer configuration
jest.useFakeTimers();

afterEach(() => {
  jest.clearAllTimers();
});

// Utilities
global.mockStore = configureMockStore([thunk])
