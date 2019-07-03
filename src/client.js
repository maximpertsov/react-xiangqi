import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_API_URL;
axios.defaults.timeout = 1000;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

export const getGame = (gameId) => axios.get(`game/${gameId}`);

export const getMoves = (gameId) => axios.get(`game/${gameId}/moves`);

export const getLastUpdate = (gameId) => axios
  .get(`game/${gameId}/last-update`);

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
  return axios.post(`game/${gameId}/moves`, payload);
}

export async function authenticate({ username, password }) {
  const payload = { username, password };
  return axios.post('authenticate', payload);
}

export default {};
