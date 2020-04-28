import axios from 'axios';
import { getInitialPosition, getMoveData } from 'services/client';

jest.mock('axios');

describe('client', () => {
  test('get next move from fen', () => {
    const payload = { fen: 'FEN' };
    getMoveData(payload);

    expect(axios.post).toHaveBeenCalledWith(`fen`, payload);
  });

  test('get initial move', async () => {
    expect(await getInitialPosition()).toStrictEqual({
      status: 200,
      data: {},
    });
    expect(axios.get).toHaveBeenCalledWith(`fen`);
  });
});
