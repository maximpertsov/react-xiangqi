import client from 'services/client';
import actions from 'actions';

const postTakebackEvent = ({ event_name, gameSlug, username }) => {
  if (!gameSlug) return;

  const payload = {
    game: gameSlug,
    name: event_name,
    payload: { username },
  };
  client.post(`game/events`, payload);
};

const request = ({ gameSlug, username }) => dispatch => {
  dispatch(actions.game.openTakebackOffer.set(username));

  postTakebackEvent({ event_name: 'offered_takeback', gameSlug, username });
};

const reject = ({ gameSlug, username }) => dispatch => {
  dispatch(actions.game.openTakebackOffer.set(null));

  postTakebackEvent({ event_name: 'rejected_takeback', gameSlug, username });
};

const cancel = ({ gameSlug, username }) => dispatch => {
  dispatch(actions.game.openTakebackOffer.set(null));

  postTakebackEvent({ event_name: 'canceled_takeback', gameSlug, username });
};

const accept = ({ gameSlug, username }) => dispatch => {
  dispatch(actions.game.openTakebackOffer.set(null));

  postTakebackEvent({ event_name: 'accepted_takeback', gameSlug, username });
};

export default {
  request,
  reject,
  cancel,
  accept,
};
