import { combineReducers } from 'redux';
import username from 'scenes/Home/components/LoginForm/reducers/username';
import password from 'scenes/Home/components/LoginForm/reducers/password';
import error from 'scenes/Home/components/LoginForm/reducers/error';

const loginForm = combineReducers({ username, password, error });

export default loginForm;
