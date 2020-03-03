import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_API_URL;
axios.defaults.timeout = 1000;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

export const ping = () => axios.get('ping');

export const getGameList = ({ username }) =>
  axios.get(`player/${username}/games`);

export const getGame = ({ gameSlug }) => axios.get(`game/${gameSlug}`);

export const getMoves = ({ gameSlug }) => axios.get(`game/${gameSlug}/moves`);

export const getMoveCount = ({ gameSlug }) =>
  axios.get(`game/${gameSlug}/move-count`);

export const postMove = ({ gameSlug, move, username }) => {
  const payload = { move, player: username };
  return axios.post(`game/${gameSlug}/moves`, payload);
};

export const getNextFen = ({ fen, move }) => {
  const payload = { fen, move };
  return axios.post(`fen/moves`, payload);
};

export const getInitialMove = () => {
  return axios.get('fen/moves');
};

export async function authenticate() {
  return axios.post('authenticate');
}

export async function login({ username, password }) {
  const payload = { username, password };
  return axios.post('login', payload);
}

export default {};
