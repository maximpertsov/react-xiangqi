import React from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';

import LobbyGame from '../LobbyGame';

jest.mock('react-redux');

describe('LobbyGame', () => {
  const id = 123;
  const parameters = { team: 'red' };
  const store = mockStore({});

  let wrapper;

  beforeEach(() => {
    useDispatch.mockReturnValue(store.dispatch);
    wrapper = shallowWrappedComponent(
      <LobbyGame id={id} parameters={parameters} />,
      store,
    );
  });

  afterEach(() => {
    store.getActions();
    jest.resetAllMocks();
  });

  test('snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test.skip('click', () => {
    wrapper.find('Button').simulate('click');

    expect(store.getActions()).toStrictEqual([
      actions.game.slug.set(id),
      actions.home.showGame.set(true),
    ]);
  });
});
