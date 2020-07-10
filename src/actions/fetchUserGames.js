import client from 'services/client';
import actions from 'actions';

const fetchUserGames = ({ username }) => async dispatch => {
  if (username === null) return;

  const { data } = await client.get(`player/${username}/games`);
  dispatch(actions.home.games.set(data.games));
};

export default fetchUserGames;
