import * as client from 'services/client';
import { Color } from 'services/logic/constants';

const setAutoMove = colors => ({ type: 'set_auto_move', colors });

export const setAutoMoveOff = () => setAutoMove([]);
export const setAutoMoveRed = () => setAutoMove([Color.RED]);
export const setAutoMoveBlack = () => setAutoMove([Color.BLACK]);
export const setAutoMoveBoth = () => setAutoMove([Color.RED, Color.BLACK]);

export const fetchGames = ({ username }) => async dispatch => {
  if (username === null) return;

  const {
    data: { games },
  } = await client.getGameList({ username });
  dispatch({ type: 'set_games', games });
};

export const setGameSlug = ({ gameSlug }) => ({
  type: 'set_game_slug',
  gameSlug,
});

export const setForm = form => dispatch => {
  const { username, password, error } = form;
  if (username !== undefined)
    return dispatch({ type: 'set_login_username', username });
  if (password !== undefined)
    return dispatch({ type: 'set_login_password', password });
  if (error !== undefined) return dispatch({ type: 'set_login_error', error });
};

export const setUsername = ({ username }) => ({
  type: 'set_username',
  username,
});

export const toggleShowGame = ({ showGame }) => ({
  type: 'toggle_show_game',
  showGame,
});

export const toggleCanMoveBothColors = ({ canMoveBothColors }) => ({
  type: 'toggle_can_move_both_colors',
  canMoveBothColors,
});

export default {};
