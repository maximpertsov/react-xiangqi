import { getGame } from 'services/client';

const setPlayers = ({ players }) => ({
  type: 'set_players',
  players,
});

export const fetchGame = ({ gameSlug }) => async dispatch => {
  if (gameSlug === null) return;

  const {
    data: { players },
  } = await getGame({ gameSlug });
  dispatch(setPlayers({ players }));
};

export default fetchGame;
