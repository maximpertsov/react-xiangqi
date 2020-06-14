import client from 'services/client';

const postResignEvent = ({ gameSlug, username }) => {
  if (!gameSlug) return;

  const payload = {
    game: gameSlug,
    name: 'resigned',
    payload: { username },
  };
  client.post(`game/events`, payload);
};

const send = ({ gameSlug, username }) => () => {
  postResignEvent({ gameSlug, username });
};

export default { send };
