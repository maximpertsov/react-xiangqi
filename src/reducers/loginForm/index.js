import { combineReducers } from 'redux';
import { handleAction } from 'redux-actions';

import actions from 'actions';

const loginForm = combineReducers({
  username: handleAction(
    actions.home.loginForm.username.set,
    (state, action) => action.payload,
    '',
  ),
  password: handleAction(
    actions.home.loginForm.password.set,
    (state, action) => action.payload,
    '',
  ),
  error: handleAction(
    actions.home.loginForm.error.set,
    (state, action) => action.payload,
    '',
  ),
  loading: handleAction(
    actions.home.loginForm.loading.set,
    (state, action) => action.payload,
    true,
  ),
});

export default loginForm;
