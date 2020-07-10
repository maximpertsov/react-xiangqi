import React from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';

import GameLink from '../GameLink';

jest.mock('react-redux');

describe('GameLink', () => {
  const slug = 'abc123';
  const store = mockStore({});

  let wrapper;

  beforeEach(() => {
    useDispatch.mockReturnValue(store.dispatch);
    wrapper = shallowWrappedComponent(<GameLink slug={slug} />, store);
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
