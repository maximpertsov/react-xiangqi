import axios from 'axios';

const BASE_URL = 'https://eb37a7da-f9f6-4bf0-afe8-a11e008e42aa.mock.pstmn.io';

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
