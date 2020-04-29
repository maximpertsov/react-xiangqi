import axios from 'axios';
import { getMoveData } from 'services/client';

jest.mock('axios');

describe('client', () => {
  test('get next move from fen', async () => {
    const payload = { fen: 'FEN' };
    await getMoveData(payload);

    expect(axios.post).toHaveBeenCalledWith(`fen`, payload);
  });
});
