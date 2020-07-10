import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Team } from 'services/logic/constants';

import NewGameMenu from '../NewGameMenu';

jest.mock('react-redux');
jest.mock('axios');

describe('NewGameMenu', () => {
  const username = 'alice';
  let store;
  let wrapper;

  beforeEach(() => {
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

      test.each(table)('%i', (content, parameters) => {
        expect.assertions(1);
        const button = wrapper.wrap(
          wrapper
            .find('Popup')
            .findWhere(node => node.prop('content') === content)
            .prop('trigger'),
        );
        button.simulate('click');

        expect(axios.post).toHaveBeenCalledWith('game/request', {
          player1: username,
          parameters,
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

    test('click', () => {
      expect.assertions(1);
      wrapper.find('Button').simulate('click');

      expect(axios.delete).toHaveBeenCalledWith(`game/request/${id}`);
    });
  });
});
