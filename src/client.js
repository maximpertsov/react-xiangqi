import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_API_URL;
axios.defaults.timeout = 1000;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

export const ping = () => axios.get('ping');

export const getGameList = (username) => axios.get(`player/${username}/games`);

export const getGame = (gameId) => axios.get(`game/${gameId}`);

export const getMoves = (gameId) => axios.get(`game/${gameId}/moves`);

export const getLastUpdate = (gameId) => axios
  .get(`game/${gameId}/last-update`);

export const getMoveCount = (gameId) => axios
  .get(`game/${gameId}/move-count`);

const getPostMovePayload = (username, board, fromSlot, toSlot) => {
  const fromPos = board.getRankFile(fromSlot);
  const toPos = board.getRankFile(toSlot);
  const piece = board.getPiece(toSlot);
  return {
    player: username, piece, from: fromPos, to: toPos, type: 'move',
  };
};

export const postMove = (gameId, {
  username, board, fromSlot, toSlot,
}) => {
  const payload = getPostMovePayload(username, board, fromSlot, toSlot);
  return axios.post(`game/${gameId}/moves`, payload);
};

export async function authenticate({ username, password }) {
  const payload = { username, password };
  return axios.post('authenticate', payload);
}

export default {};
