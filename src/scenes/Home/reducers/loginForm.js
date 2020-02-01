import { combineReducers } from 'redux';
import username from 'scenes/Home/components/LoginForm/reducers/username';
import password from 'scenes/Home/components/LoginForm/reducers/password';
import error from 'scenes/Home/components/LoginForm/reducers/error';
import loading from 'scenes/Home/components/LoginForm/reducers/loading';

const loginForm = combineReducers({ username, password, error, loading });

export default loginForm;
