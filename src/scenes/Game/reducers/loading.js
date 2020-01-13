export const loading = (state = false, action) => {
  switch (action.type) {
  case 'toggle_loading':
    return action.loading;
  default:
    return state;
  }
};

export default {};
