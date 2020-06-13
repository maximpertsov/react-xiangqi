import client from 'services/client';
import actions from 'actions';

const postDrawEvent = ({ event_name, gameSlug, username }) => {
  if (!gameSlug) return;

  const payload = {
    game: gameSlug,
    name: event_name,
    payload: { username },
  };
  client.post(`game/events`, payload);
};

const request = ({ gameSlug, username }) => dispatch => {
  dispatch(actions.game.openDrawOffer.set(username));

  postDrawEvent({ event_name: 'offered_draw', gameSlug, username });
};

const reject = ({ gameSlug, username }) => dispatch => {
  dispatch(actions.game.openDrawOffer.set(null));

  postDrawEvent({ event_name: 'rejected_draw', gameSlug, username });
};

const cancel = ({ gameSlug, username }) => dispatch => {
  dispatch(actions.game.openDrawOffer.set(null));

  postDrawEvent({ event_name: 'canceled_draw', gameSlug, username });
};

const accept = ({ gameSlug, username }) => dispatch => {
  dispatch(actions.game.openDrawOffer.set(null));

  postDrawEvent({ event_name: 'accepted_draw', gameSlug, username });
};

export default {
  request,
  reject,
  cancel,
  accept,
};
