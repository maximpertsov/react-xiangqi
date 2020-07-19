import actions from 'actions';
import client from 'services/client';

const postTakebackEvent = ({ io, event_name, gameSlug, username }) => {
  if (!gameSlug) return;

  const payload = {
    game: gameSlug,
    name: event_name,
    payload: { username },
  };
  client.post(`game/events`, payload).then(() => {
    io.send({
      type: event_name,
      payload: {
        gameSlug,
        username,
      },
    });
  });
};

const request = ({ io, gameSlug, username }) => dispatch => {
  dispatch(actions.game.openTakebackOffer.set(username));

  return postTakebackEvent({
    io,
    event_name: 'offered_takeback',
    gameSlug,
    username,
  });
};

const reject = ({ io, gameSlug, username }) => dispatch => {
  dispatch(actions.game.openTakebackOffer.set(null));

  return postTakebackEvent({
    io,
    event_name: 'rejected_takeback',
    gameSlug,
    username,
  });
};

const cancel = ({ io, gameSlug, username }) => dispatch => {
  dispatch(actions.game.openTakebackOffer.set(null));

  return postTakebackEvent({
    io,
    event_name: 'canceled_takeback',
    gameSlug,
    username,
  });
};

const accept = ({ io, gameSlug, username }) => dispatch => {
  dispatch(actions.game.openTakebackOffer.set(null));

  return postTakebackEvent({
    io,
    event_name: 'accepted_takeback',
    gameSlug,
    username,
  });
};

export default {
  request,
  reject,
  cancel,
  accept,
};
