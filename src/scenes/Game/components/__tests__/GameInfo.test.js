import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import GameInfo from 'scenes/Game/components/GameInfo';

const state = {
  animationOffset: [0, 0],
  gameSlug: 'ABC123',
  showConfirmMoveMenu: true,
  moves: [
    { uci: null, fen: 'FEN0' },
    { uci: 'a1a2', fen: 'FEN1' },
  ],
  selectedFen: 'FEN1',
  selectedSquare: null,
  showGame: true,
  username: 'user',
};

const componentWithStore = (component, state) => (
  // eslint-disable-next-line no-undef
  <Provider store={mockStore(state)}>{component}</Provider>
);

describe('GameInfo', () => {
  test('renders without crashing', () => {
    const wrapper = mount(componentWithStore(<GameInfo />, state));
    expect(wrapper.containsMatchingElement(<p>Your turn</p>)).toBeTruthy();
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.unmount();
  });
});
