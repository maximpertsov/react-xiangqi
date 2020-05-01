import { handleAction } from 'redux-actions';

const gameSlug = handleAction(
  'GAME/SLUG/SET',
  (state, action) => action.payload,
  null,
);

export default gameSlug;
