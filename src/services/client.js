import axios from 'axios';

import camelCase from 'lodash/camelCase';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import mapKeys from 'lodash/mapKeys';

axios.defaults.baseURL = process.env.REACT_APP_BASE_API_URL;
axios.defaults.timeout = 1000;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

const camelCaseData = data => {
  if (isArray(data)) return data.map(camelCaseData);
  if (isPlainObject(data)) return mapKeys(data, (value, key) => camelCase(key));
  return data;
};

axios.interceptors.response.use(
  response => ({ ...response, data: camelCaseData(response.data) }),
  error => Promise.reject(error),
);

export const ping = () => axios.get('ping');

export const getGameList = ({ username }) =>
  axios.get(`player/${username}/games`);

export const getGame = ({ gameSlug }) => axios.get(`game/${gameSlug}`);

export const poll = ({ gameSlug }) => axios.get(`game/${gameSlug}/poll`);

export const postMove = ({ gameSlug, move, username }) => {
  const payload = { name: 'move', move, player: username };
  return axios.post(`game/${gameSlug}/events`, payload);
};

export const getMoveData = ({ fen }) => {
  const payload = { fen };
  return axios.post(`fen`, payload);
};

export async function authenticate() {
  return axios.post('authenticate');
}

export async function login({ username, password }) {
  const payload = { username, password };
  return axios.post('login', payload);
}

const client = axios;

export default client;
