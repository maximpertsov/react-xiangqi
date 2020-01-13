import { Color } from 'services/logic/constants';

const initialPlayers = [
  { name: undefined, color: Color.RED },
  { name: undefined, color: Color.BLACK },
];

export const players = (state = initialPlayers, action) => {
  switch (action.type) {
  case 'SET_PLAYERS':
    return action.players;
  default:
    return state;
  }
};

export default {};
