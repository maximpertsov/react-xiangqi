import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';
import { Team } from 'services/logic/constants';

import NewGameMenu from '../NewGameMenu';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));
jest.mock('react-redux');
jest.mock('axios');

describe('NewGameMenu', () => {
  const username = 'alice';
  const io = { send: jest.fn() };

  let store;
  let wrapper;

  beforeEach(() => {
    useContext.mockReturnValue(io);
    useSelector.mockImplementation(callback => callback(store.getState()));
    wrapper = shallowWrappedComponent(<NewGameMenu />, store);
  });

  afterEach(() => {
    store.clearActions();
    jest.resetAllMocks();
  });

  describe('did not make game request', () => {
    beforeAll(() => {
      store = mockStore({
        lobbyGames: [{ id: 123, player1: 'bob', parameters: {} }],
        username,
      });
    });

    beforeEach(() => {
      axios.post.mockResolvedValue({});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('click', () => {
      const table = [
        ['Play with red pieces', { team: Team.RED }],
        ['Play with black pieces', { team: Team.BLACK }],
        ['Play with random pieces', { team: undefined }],
      ];

      test.each(table)('%s', async (content, parameters) => {
        expect.assertions(2);
        const button = wrapper.wrap(
          wrapper
            .find('Popup')
            .findWhere(node => node.prop('content') === content)
            .prop('trigger'),
        );
        button.simulate('click');

        await expect(axios.post).toHaveBeenCalledWith('game/request', {
          player1: username,
          parameters,
        });
        expect(io.send).toHaveBeenCalledWith({
          type: 'updated_lobby_games',
        });
      });
    });
  });

  describe('already made game request', () => {
    const id = 789;

    beforeAll(() => {
      store = mockStore({
        lobbyGames: [{ id, player1: username, parameters: {} }],
        username,
      });
    });

    beforeEach(() => {
      axios.delete.mockResolvedValue({});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', async () => {
      expect.assertions(2);
      wrapper.find('Button').simulate('click');

      await expect(axios.delete).toHaveBeenCalledWith(`game/request/${id}`);
      expect(io.send).toHaveBeenCalledWith({
        type: 'updated_lobby_games',
      });
    });
  });
});
