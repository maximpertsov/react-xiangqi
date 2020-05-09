import client from 'services/client';

async function login({ username, password }) {
  const payload = { username, password };
  return axios.post('token/obtain', payload); }
