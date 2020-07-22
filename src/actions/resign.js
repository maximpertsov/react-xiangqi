import client from 'services/client';

const EVENT_TYPE = 'resigned';

const postResignEvent = ({ io, gameSlug, username }) => {
  if (!gameSlug) return;

  client
    .post(`game/events`, {
      game: gameSlug,
      name: EVENT_TYPE,
      payload: { username },
    })
    .then(() => {
      io.send(EVENT_TYPE, { gameSlug, username });
    });
};

const send = ({ io, gameSlug, username }) => () =>
  postResignEvent({ io, gameSlug, username });

export default { send };
