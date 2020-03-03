import axios from 'axios';
import { getNextFen } from 'services/client';

describe('client', () => {
  jest.mock('axios');

  test('get next move from fen', () => {
    axios.post = jest.fn(() => Promise.resolve({}));

    const move = 'MOVE';
    const fen = 'FEN 0';
    const payload = { fen, move };
    getNextFen(payload);

    expect(axios.post).toHaveBeenCalledWith(`fen/moves`, payload);
  });
});
