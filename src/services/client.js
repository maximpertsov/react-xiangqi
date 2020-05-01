import axios from 'axios';

import _camelCase from 'lodash/camelCase';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import fromPairs from 'lodash/fromPairs';
import toPairs from 'lodash/toPairs';

axios.defaults.baseURL = process.env.REACT_APP_BASE_API_URL;
axios.defaults.timeout = 1000;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

const camelCase = string =>
  // Lodash's camel-casing function is too aggressive.
  // For example, it transforms move keys such as 'a1a2'
  // into 'a1A2'. This function makes sure that camel-casing
  // is only performed on strings that include an underscore
  // character.
  string.includes('_') ? _camelCase(string) : string;

// TODO: add a test for this
const deepCamelCase = data => {
  if (isPlainObject(data)) {
    const pairs = toPairs(data).map(([key, value]) => [
      camelCase(key),
      deepCamelCase(value),
    ]);
    return fromPairs(pairs);
  }
  if (isArray(data)) {
    return data.map(deepCamelCase);
  }
  return data;
};

axios.interceptors.response.use(
  response => ({ ...response, data: deepCamelCase(response.data) }),
  error => Promise.reject(error),
);

export const ping = () => axios.get('ping');

export const getGameList = ({ username }) =>
  axios.get(`player/${username}/games`);

export const poll = ({ gameSlug }) => axios.get(`game/${gameSlug}/poll`);

export async function authenticate() {
  return axios.post('authenticate');
}

export async function login({ username, password }) {
  const payload = { username, password };
  return axios.post('login', payload);
}

const client = axios;

export default client;
