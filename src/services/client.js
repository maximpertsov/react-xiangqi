import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_API_URL;
axios.defaults.timeout = 1000;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

export const ping = () =>
  axios.get('ping');

export const getGameList = (username) =>
  axios.get(`player/${username}/games`);

export const getGame = ({ gameId }) =>
  axios.get(`game/${gameId}`);

export const getMoves = ({ gameId }) =>
  axios.get(`game/${gameId}/moves`);

export const getMoveCount = ({ gameId }) =>
  axios.get(`game/${gameId}/move-count`);

export const postMove = ({ gameId, username, fromPos, toPos }) => {
  const payload = {
    player: username,
    fromPos,
    toPos,
    type: 'move',
  };
  return axios.post(`game/${gameId}/moves`, payload);
};

export async function authenticate() {
  return axios.post('authenticate');
}

export async function login({ username, password }) {
  const payload = { username, password };
  return axios.post('login', payload);
}

export default {};
