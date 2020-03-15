const gameSlug = (state = null, action) => {
  switch (action.type) {
  case 'set_game_slug':
    return action.gameSlug;
  default:
    return state;
  }
};

export default gameSlug;
