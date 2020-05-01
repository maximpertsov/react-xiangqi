import { Color } from 'services/logic/constants';

const initialPlayers = [
  { name: undefined, color: Color.RED },
  { name: undefined, color: Color.BLACK },
];

const players = (state = initialPlayers, action) => {
  switch (action.type) {
    case 'GAME/PLAYERS/SET':
      return action.payload;
    default:
      return state;
  }
};

export default players;
