import * as client from 'services/client';

export const fetchGames = ({ username }) => async dispatch => {
  if (username === null) return;

  const {
    data: { games },
  } = await client.getGameList({ username });
  dispatch({ type: 'set_games', games });
};

export const setForm = form => dispatch => {
  const { username, password, error } = form;
  if (username !== undefined) {
    dispatch({ type: 'set_login_username', username });
  }
  if (password !== undefined) {
    dispatch({ type: 'set_login_password', password });
  }
  if (error !== undefined) {
    dispatch({ type: 'set_login_error', error });
  }
};

export default {};
