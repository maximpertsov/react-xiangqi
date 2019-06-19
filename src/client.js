import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

axios.defaults.baseURL = `${BASE_URL}/api/`;
axios.defaults.timeout = 1000;

export const getGame = (gameId) => axios.get(`game/${gameId}`);

export const getMoves = (gameId) => axios.get(`game/${gameId}/move`);

export async function postMove(gameId, {
  player, piece, fromPos, toPos,
}) {
  const payload = {
    player,
    piece,
    from: fromPos,
    to: toPos,
    type: 'move',
  };
  return axios.post(`game/${gameId}/move`, payload);
}

export default {};
