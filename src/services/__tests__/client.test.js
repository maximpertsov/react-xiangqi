import axios from 'axios';
import { getInitialPosition, getMoveData } from 'services/client';

jest.mock('axios');

describe('client', () => {
  test('get next move from fen', () => {
    axios.post = jest.fn(() => Promise.resolve({}));

    const fen = 'FEN 0';
    const payload = { fen };
    getMoveData(payload);

    expect(axios.post).toHaveBeenCalledWith(`fen`, payload);
  });

  test('get initial move', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: {},
    });

    expect(await getInitialPosition()).toStrictEqual({
      status: 200,
      data: {},
    });
    expect(axios.get).toHaveBeenCalledWith(`fen`);
  });
});
