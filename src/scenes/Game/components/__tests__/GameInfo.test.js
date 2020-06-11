import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import GameInfo from 'scenes/Game/components/GameInfo';

const defaultState = {
  animationOffset: [0, 0],
  gameSlug: 'ABC123',
  showGame: true,
  redPlayer: { name: 'alice' },
  blackPlayer: { name: 'bob' },
  username: 'alice',
};

const componentWithStore = (component, state) => (
  // eslint-disable-next-line no-undef
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
      redScore: 1,
    };
    const wrapper = mount(componentWithStore(<GameInfo />, state));
    expect(wrapper.containsMatchingElement(<p>alice wins!</p>)).toBeTruthy();
    wrapper.unmount();
  });

  test('Black wins', () => {
    const state = {
      ...defaultState,
      blackScore: 1,
    };
    const wrapper = mount(componentWithStore(<GameInfo />, state));
    expect(wrapper.containsMatchingElement(<p>bob wins!</p>)).toBeTruthy();
    wrapper.unmount();
  });

  test('Draw', () => {
    const state = {
      ...defaultState,
      redScore: 0.5,
      blackScore: 0.5,
    };
    const wrapper = mount(componentWithStore(<GameInfo />, state));
    expect(wrapper.containsMatchingElement(<p>Draw!</p>)).toBeTruthy();
    wrapper.unmount();
  });
});
