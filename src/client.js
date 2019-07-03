import axios from 'axios';

const PROD_URL = 'https://xchess.herokuapp.com';
const LOCAL_URL = 'http://localhost:8000';

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') return PROD_URL;
  return LOCAL_URL;
};

axios.defaults.baseURL = `${getBaseUrl()}/api/`;
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
