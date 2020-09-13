import actions from 'actions';

const logout = () => dispatch => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  dispatch(actions.home.username.set(null));
};

export default logout;
