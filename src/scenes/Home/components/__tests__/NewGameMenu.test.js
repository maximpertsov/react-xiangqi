import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import NewGameMenu from '../NewGameMenu';

jest.mock('react-redux');
jest.mock('axios');

describe('NewGameMenu', () => {
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
        username: 'alice',
      });
    });

    beforeEach(() => {
      axios.post.mockResolvedValue({});
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('click', () => {
      expect.assertions(1);
      const button = wrapper.wrap(
        wrapper
          .find('Popup')
          .first()
          .prop('trigger'),
      );
      button.simulate('click');

      // TODO: called with?
      expect(axios.post).toHaveBeenCalled();
    });
  });

  describe('already made game request', () => {
    beforeAll(() => {
      store = mockStore({
        lobbyGames: [{ id: 789, player1: 'alice', parameters: {} }],
        username: 'alice',
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

      // TODO: called with?
      expect(axios.delete).toHaveBeenCalled();
    });
  });
});
