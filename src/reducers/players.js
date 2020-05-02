import { handleAction } from 'redux-actions';
import { Color } from 'services/logic/constants';

const initialState = [
  { name: undefined, color: Color.RED },
  { name: undefined, color: Color.BLACK },
];

const players = handleAction(
  'GAME/PLAYERS/SET',
  (state, action) => action.payload,
  initialState,
);

export default players;
