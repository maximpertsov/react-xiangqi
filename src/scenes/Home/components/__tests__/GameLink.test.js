import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';

import GameLink from '../GameLink';

jest.mock('react-redux');

describe('GameLink', () => {
  const slug = 'abc123';
  const store = mockStore({ username: 'alice' });

  let wrapper;

  beforeEach(() => {
    useDispatch.mockReturnValue(store.dispatch);
    useSelector.mockImplementation(callback => callback(store.getState()));
    wrapper = shallowWrappedComponent(
      <GameLink
        game={{
          slug,
          currentMove: {},
          player1: { name: 'alice' },
          player2: { name: 'bob' },
        }}
      />,
      store,
    );
  });

  afterEach(() => {
    store.clearActions();
    jest.resetAllMocks();
  });

  test('snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('click', () => {
    wrapper.find('Button').simulate('click');

    expect(store.getActions()).toStrictEqual([
      actions.game.slug.set(slug),
      actions.home.showGame.set(true),
    ]);
  });
});
