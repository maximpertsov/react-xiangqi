import axios from 'axios';
import { getInitialMove, getMoveData } from 'services/client';

describe('client', () => {
  jest.mock('axios');

  test('get next move from fen', () => {
    axios.post = jest.fn(() => Promise.resolve({}));

    const fen = 'FEN 0';
    const payload = { fen };
    getMoveData(payload);

    expect(axios.post).toHaveBeenCalledWith(`fen`, payload);
  });

  test('get initial move', () => {
    axios.get = jest.fn(() => Promise.resolve({}));

    getInitialMove();

    expect(axios.get).toHaveBeenCalledWith(`fen`);
  });
});
