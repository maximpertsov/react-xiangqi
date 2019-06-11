import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

axios.defaults.baseURL = `${BASE_URL}/api/`;
axios.defaults.timeout = 1000;

export async function getGame(gameId) {
  try {
    const response = await axios.get(`game/${gameId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function postMove(gameId, player, piece, from, to) {
  const payload = {
    player,
    piece,
    from,
    to,
    type: 'move',
  };
  try {
    console.log(`Posting move to game ${gameId} with payload ${JSON.stringify(payload)}`);
    const response = await axios.post(`game/${gameId}`, payload);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default {};
