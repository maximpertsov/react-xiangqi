// TODO: define function to transform games payload

const games = (state = [], action) => {
  switch (action.type) {
  case 'set_games':
    return action.games;
  default:
    return state;
  }
};

export default games;
