import actions from 'actions';
import client from 'services/client';

const postDrawEvent = ({ event_name, gameSlug, io, username }) => {
  if (!gameSlug) return;

  client
    .post(`game/events`, {
      game: gameSlug,
      name: event_name,
      payload: { username },
    })
    .then(() => {
      io.send({
        type: event_name,
        payload: {
          gameSlug,
          username,
        },
      });
    });
};

const request = ({ gameSlug, io, username }) => dispatch => {
  dispatch(actions.game.openDrawOffer.set(username));

  return postDrawEvent({ event_name: 'offered_draw', gameSlug, io, username });
};

const reject = ({ gameSlug, io, username }) => dispatch => {
  dispatch(actions.game.openDrawOffer.set(null));

  return postDrawEvent({ event_name: 'rejected_draw', gameSlug, io, username });
};

const cancel = ({ gameSlug, io, username }) => dispatch => {
  dispatch(actions.game.openDrawOffer.set(null));

  return postDrawEvent({ event_name: 'canceled_draw', gameSlug, io, username });
};

const accept = ({ gameSlug, io, username }) => dispatch => {
  dispatch(actions.game.openDrawOffer.set(null));

  return postDrawEvent({ event_name: 'accepted_draw', gameSlug, io, username });
};

export default {
  request,
  reject,
  cancel,
  accept,
};
