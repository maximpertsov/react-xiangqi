import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import GameInfo from 'scenes/Game/components/GameInfo';

const defaultState = {
  animationOffset: [0, 0],
  gameSlug: 'ABC123',
  showGame: true,
  player1: { name: 'alice' },
  player2: { name: 'bob' },
  username: 'alice',
};

const componentWithStore = (component, state) => (
  <Provider store={mockStore(state)}>{component}</Provider>
);

describe('GameInfo', () => {
  test('Your turn', () => {
    const state = {
      ...defaultState,
      moves: [{ fen: 'FEN0 w' }],
    };
    const wrapper = mount(componentWithStore(<GameInfo />, state));
    expect(wrapper.containsMatchingElement(<p>Your turn</p>)).toBeTruthy();
    wrapper.unmount();
  });

  test('Waiting for opponent', () => {
    const state = {
      ...defaultState,
      moves: [{ fen: 'FEN0 w' }, { fen: 'FEN1 b' }],
    };
    const wrapper = mount(componentWithStore(<GameInfo />, state));
    expect(
      wrapper.containsMatchingElement(<p>Waiting for opponent</p>),
    ).toBeTruthy();
    wrapper.unmount();
  });

  test('Red wins', () => {
    const state = {
      ...defaultState,
      score1: 1,
    };
    const wrapper = mount(componentWithStore(<GameInfo />, state));
    expect(wrapper.containsMatchingElement(<p>alice wins!</p>)).toBeTruthy();
    wrapper.unmount();
  });

  test('Black wins', () => {
    const state = {
      ...defaultState,
      score2: 1,
    };
    const wrapper = mount(componentWithStore(<GameInfo />, state));
    expect(wrapper.containsMatchingElement(<p>bob wins!</p>)).toBeTruthy();
    wrapper.unmount();
  });

  test('Draw', () => {
    const state = {
      ...defaultState,
      score1: 0.5,
      score2: 0.5,
    };
    const wrapper = mount(componentWithStore(<GameInfo />, state));
    expect(wrapper.containsMatchingElement(<p>Draw!</p>)).toBeTruthy();
    wrapper.unmount();
  });
});
