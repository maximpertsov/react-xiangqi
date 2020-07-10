import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import LobbyGame from '../LobbyGame';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));
jest.mock('react-redux');
jest.mock('axios');

describe('LobbyGame', () => {
  const id = 123;
  const username = 'alice';
  const parameters = { team: 'red' };
  const gameSlug = 'abc123';
  const store = mockStore({ username });
  const io = { send: jest.fn() };

  let wrapper;

  beforeEach(() => {
    useContext.mockReturnValue(io);
    useSelector.mockImplementation(callback => callback(store.getState()));

    axios.patch.mockResolvedValue({
      data: {
        game: gameSlug,
        player1: 'bob',
        player2: username,
      },
    });

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

  test('click', async () => {
    expect.assertions(2);
    wrapper.find('Button').simulate('click');

    await expect(axios.patch).toHaveBeenCalledWith(`game/request/${id}`, {
      player2: username,
    });
    expect(io.send).toHaveBeenCalledWith({
      type: 'joined_lobby_game',
      game: gameSlug,
      players: ['bob', username],
    });
  });
});
