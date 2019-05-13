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

export async function getInitialPosition() {
  try {
    const response = await axios.get('initial-position');
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default {};
